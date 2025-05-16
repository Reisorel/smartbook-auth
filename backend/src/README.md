## 📦 Convention de nommage des fichiers backend

Le projet suit une convention stricte pour nommer les fichiers backend, afin de garantir lisibilité, cohérence et maintenabilité du code.

### 🔤 Structure des fichiers TypeScript (`.ts`)

Les fichiers utilisent la convention suivante :
**`nom.rôle.ts`**, avec des noms en **kebab-case** et des suffixes indiquant la fonction du fichier.

| Type de fichier        | Convention         | Exemple               |
|------------------------|--------------------|------------------------|
| Contrôleur             | `nom.controller.ts` | `user.controller.ts`  |
| Route                  | `nom.routes.ts`     | `book.routes.ts`      |
| Modèle (Mongoose)      | `nom.model.ts`      | `cart.model.ts`       |
| Service métier         | `nom.service.ts`    | `auth.service.ts`     |
| Utilitaire             | `nom.utils.ts`      | `jwt.utils.ts`        |

### 📁 Structure des dossiers

Les noms de dossiers sont tous en **kebab-case** :

