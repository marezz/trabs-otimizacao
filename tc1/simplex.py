import numpy as np
import pandas as pd

# ─────────────────────────────────────────
#  INPUT
# ─────────────────────────────────────────

def ler_restricao(contagem, qtd_var):
    """Read one restriction from stdin and return a validated list."""
    while True:
        if contagem == 0:
            entrada = input("Função objetiva: ").split()
            if len(entrada) != qtd_var:
                print(f"  Erro: insira exatamente {qtd_var} coeficientes.")
                continue
            return [float(c) for c in entrada]
        else:
            entrada = input(f"Restrição {contagem}: ").split()
            if len(entrada) != qtd_var + 2 or entrada[-2] not in ("<=", ">=", "="):
                print(f"  Erro: insira {qtd_var} coeficientes, operador e resultado (ex: 1 -2 1 <= 11).")
                continue
            return [float(c) for c in entrada[:-2]] + [entrada[-2], float(entrada[-1])]

def ler_problema():
    """Read the full problem from stdin and return (tipo, expressoes)."""
    print("Bem vindo ao PPL Solver!\n")

    while True:
        tipo = input("Sua função objetiva é de máximo ou mínimo? (max / min): ")
        if tipo in ("max", "min"):
            break
        print("  Erro: digite 'max' ou 'min'.")

    qtd_var        = int(input("Insira a quantidade de variáveis do problema: "))
    qtd_restricoes = int(input("Insira a quantidade de restrições: "))

    expressoes = []
    for contagem in range(qtd_restricoes + 1):   # 0 = objective, 1..n = restrictions
        expressoes.append(ler_restricao(contagem, qtd_var))

    return tipo, expressoes

# ─────────────────────────────────────────
#  DISPLAY
# ─────────────────────────────────────────

def _termo(coef, idx):
    """Format a single term like '+ 2x1'. Returns None for zero."""
    if coef == 0:
        return None
    sinal     = "+" if coef > 0 else "-"
    valor     = abs(coef)
    valor_str = str(int(valor)) if valor == int(valor) else str(valor)
    return f"{sinal} {valor_str}x{idx + 1}"

def imprimir_expressoes(tipo, expressoes):
    print("\n--- PPL Inserido ---")
    termos = [_termo(c, i) for i, c in enumerate(expressoes[0])]
    print(f"{tipo}   {'  '.join(t for t in termos if t)}")
    print("s.a", end="")
    for k, expr in enumerate(expressoes[1:]):
        coefs, operador, resultado = expr[:-2], expr[-2], expr[-1]
        termos      = [_termo(c, i) for i, c in enumerate(coefs)]
        resultado_str = str(int(resultado)) if resultado == int(resultado) else str(resultado)
        prefix      = "    " if k == 0 else "       "
        print(f"{prefix}{'  '.join(t for t in termos if t)}  {operador}  {resultado_str}")

def _label(b, qtd_var, qtd_rest):
    """Return the display label for a basis variable index."""
    if b < qtd_var:
        return f"x{b + 1}"
    elif b < qtd_var + qtd_rest:
        return f"f{b - qtd_var + 1}"
    else:
        return f"a{b - qtd_var - qtd_rest + 1}"

def imprimir_tableau(tableau, base, qtd_var, qtd_rest, titulo=None):
    """Pretty-print a simplex tableau using pandas."""
    if titulo:
        print(f"\n--- {titulo} ---")
    total_cols = tableau.shape[1] - 1
    qtd_art    = total_cols - qtd_var - qtd_rest
    cols  = ([f"x{i+1}" for i in range(qtd_var)]  +
             [f"f{i+1}" for i in range(qtd_rest)] +
             [f"a{i+1}" for i in range(qtd_art)]  + ["b"])
    index = [_label(b, qtd_var, qtd_rest) for b in base] + ["obj"]
    print(pd.DataFrame(tableau, index=index, columns=cols).round(4).to_string())

# ─────────────────────────────────────────
#  SIMPLEX CORE
# ─────────────────────────────────────────

def _canonizar_obj(obj_row, tableau, base):
    """Adjust objective row so basic variable columns are zero."""
    for i, b in enumerate(base):
        if obj_row[b] != 0:
            obj_row -= obj_row[b] * tableau[i]

def _pivotar(tableau, obj_row, pivot_row, pivot_col):
    """Perform one pivot operation in-place."""
    tableau[pivot_row] /= tableau[pivot_row, pivot_col]
    for i in range(len(tableau)):
        if i != pivot_row:
            tableau[i] -= tableau[i, pivot_col] * tableau[pivot_row]
    obj_row -= obj_row[pivot_col] * tableau[pivot_row]

def _resolver(tableau, base, c, qtd_var, qtd_rest, fase):
    """
    Run the simplex method on `tableau` with objective vector `c`.
    Prints each iteration. Returns (tableau_with_obj_row, solucao).
    """
    total_cols = tableau.shape[1] - 1
    obj_row    = np.zeros(total_cols + 1)
    obj_row[:len(c)] = c
    _canonizar_obj(obj_row, tableau, base)

    iteracao = 1
    while True:
        pivot_col = int(np.argmin(obj_row[:-1]))
        if obj_row[pivot_col] >= -1e-9:
            break                                          # optimal

        ratios = [(tableau[i, -1] / tableau[i, pivot_col], i)
                  for i in range(len(tableau))
                  if tableau[i, pivot_col] > 1e-9]
        if not ratios:
            raise ValueError("Problema ilimitado.")
        _, pivot_row = min(ratios)

        _pivotar(tableau, obj_row, pivot_row, pivot_col)
        base[pivot_row] = pivot_col

        imprimir_tableau(
            np.vstack([tableau, obj_row]), base, qtd_var, qtd_rest,
            titulo=(f"Fase {fase} - Iteração {iteracao}  "
                    f"(pivot: {_label(pivot_col, qtd_var, qtd_rest)}, "
                    f"row {pivot_row + 1})")
        )
        iteracao += 1

    solucao = np.zeros(qtd_var)
    for i, b in enumerate(base):
        if b < qtd_var:
            solucao[b] = tableau[i, -1]

    return np.vstack([tableau, obj_row]), solucao

def fase_1(tableau, artificiais, qtd_var, qtd_rest):
    """Add artificials, minimize them (Phase I), strip them before returning."""
    qtd_art  = len(artificiais)
    art_cols = np.zeros((tableau.shape[0], qtd_art))
    for j, row_idx in enumerate(artificiais):
        art_cols[row_idx, j] = 1
    tableau = np.hstack([tableau[:, :-1], art_cols, tableau[:, -1:]])

    c_fase1 = np.zeros(qtd_var + qtd_rest + qtd_art)
    c_fase1[qtd_var + qtd_rest:] = 1

    base = [qtd_var + qtd_rest + artificiais.index(i) if i in artificiais
            else qtd_var + i
            for i in range(qtd_rest)]

    tableau, _ = _resolver(tableau, base, c_fase1, qtd_var, qtd_rest, fase=1)

    for i, b in enumerate(base):
        if b >= qtd_var + qtd_rest and tableau[i, -1] > 1e-9:
            raise ValueError("Problema inviável: variáveis artificiais não zeraram na Fase I.")

    art_start = qtd_var + qtd_rest
    tableau   = np.delete(tableau[:-1], range(art_start, art_start + qtd_art), axis=1)
    return tableau, base

def fase_2(tableau, base, c, qtd_var, qtd_rest):
    return _resolver(tableau, base, c, qtd_var, qtd_rest, fase=2)

# ─────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────

def simplex(tipo, expressoes):
    func_obj   = np.array(expressoes[0], dtype=float)
    restricoes = expressoes[1:]
    qtd_var    = len(func_obj)
    qtd_rest   = len(restricoes)

    # Build tableau [A | I_slack | b]
    A = np.zeros((qtd_rest, qtd_var + qtd_rest))
    b = np.zeros(qtd_rest)
    slack_types = []

    for i, rest in enumerate(restricoes):
        A[i, :qtd_var] = rest[:-2]
        b[i]           = rest[-1]
        operador       = rest[-2]
        if operador == "<=":
            A[i, qtd_var + i] = 1;  slack_types.append(1)
        elif operador == ">=":
            A[i, qtd_var + i] = -1; slack_types.append(-1)
        elif operador == "=":
            slack_types.append(0)

    tableau     = np.hstack([A, b.reshape(-1, 1)])
    artificiais = [i for i, s in enumerate(slack_types) if s != 1]

    if artificiais:
        tableau, base = fase_1(tableau, artificiais, qtd_var, qtd_rest)
    else:
        base = list(range(qtd_var, qtd_var + qtd_rest))

    c = func_obj if tipo == "min" else -func_obj
    tableau, solucao = fase_2(tableau, base, c, qtd_var, qtd_rest)

    imprimir_tableau(tableau, base, qtd_var, qtd_rest, titulo="Tableau Final")
    print(f"\nSolução ótima:  {solucao}")
    print(f"Valor objetivo: {tableau[-1, -1]:.4f}")
    return tableau, solucao

def main():
    tipo, expressoes = ler_problema()
    imprimir_expressoes(tipo, expressoes)
    simplex(tipo, expressoes)

if __name__ == "__main__":
    main()