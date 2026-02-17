# 🧪 Guide de Tests Postman - NovaBank API

## 📥 Importation de la collection

1. Ouvrez Postman
2. Cliquez sur **Import**
3. Sélectionnez le fichier `NovaBank_API.postman_collection.json`
4. La collection "NovaBank API" apparaît dans votre sidebar

---

## ⚙️ Configuration des variables

La collection utilise 3 variables :
- `base_url` : http://localhost:3000 (déjà configuré)
- `user_id` : ID de l'utilisateur (à modifier selon vos besoins)
- `transaction_id` : ID d'une transaction (pour les suppressions)

### Modifier les variables :
1. Clic droit sur la collection "NovaBank API"
2. **Edit** → Onglet **Variables**
3. Modifier les valeurs selon vos besoins

---

## 🧪 Scénarios de test complets

### Scénario 1 : Créer un nouvel utilisateur et tester les transactions

#### Étape 1 : Créer un compte
```
POST /register
Body:
{
  "nom": "Test User",
  "email": "test@novabank.com",
  "mot_de_passe": "test123"
}
```
✅ **Résultat attendu :** Code 201, retourne user + token

#### Étape 2 : Se connecter
```
POST /login
Body:
{
  "email": "test@novabank.com",
  "mot_de_passe": "test123"
}
```
✅ **Résultat attendu :** Code 200, retourne user + token
📝 **Action :** Notez le `user.id` retourné et mettez à jour la variable `user_id`

#### Étape 3 : Créer un revenu
```
POST /transactions
Body:
{
  "id_user": {{user_id}},
  "id_categorie": 1,
  "id_sous_categorie": 1,
  "titre": "Salaire Décembre",
  "description": "Salaire mensuel",
  "montant": 2500.00,
  "date_transaction": "2025-12-01",
  "lieu": "Entreprise ABC"
}
```
✅ **Résultat attendu :** Code 201, transaction créée

#### Étape 4 : Créer plusieurs dépenses

**Loyer :**
```
POST /transactions
Body:
{
  "id_user": {{user_id}},
  "id_categorie": 2,
  "id_sous_categorie": 3,
  "titre": "Loyer Décembre",
  "montant": 700.00,
  "date_transaction": "2025-12-05"
}
```

**Courses :**
```
POST /transactions
Body:
{
  "id_user": {{user_id}},
  "id_categorie": 2,
  "id_sous_categorie": 2,
  "titre": "Courses Carrefour",
  "montant": 85.50,
  "date_transaction": "2025-12-10"
}
```

**Shopping :**
```
POST /transactions
Body:
{
  "id_user": {{user_id}},
  "id_categorie": 2,
  "id_sous_categorie": 6,
  "titre": "Vêtements H&M",
  "montant": 120.00,
  "date_transaction": "2025-12-12"
}
```

#### Étape 5 : Lister toutes les transactions
```
GET /transactions?user_id={{user_id}}
```
✅ **Résultat attendu :** Liste de toutes les transactions créées

#### Étape 6 : Supprimer une transaction
```
DELETE /transactions/5?user_id={{user_id}}
```
📝 **Action :** Remplacez `5` par l'ID d'une transaction existante
✅ **Résultat attendu :** Code 200, transaction supprimée

---

### Scénario 2 : Test des virements

#### Prérequis : Avoir 2 utilisateurs

1. Créer utilisateur 1 (user_id=1) avec 1000€ de solde
2. Créer utilisateur 2 (user_id=2)

#### Test de virement
```
POST /virements
Body:
{
  "from_user": 1,
  "to_user": 2,
  "montant": 100.00,
  "titre": "Remboursement",
  "description": "Remboursement resto"
}
```

✅ **Résultat attendu :** 
- Utilisateur 1 : -100€ (dépense)
- Utilisateur 2 : +100€ (revenu)

#### Vérification
```
GET /transactions?user_id=1
GET /transactions?user_id=2
```

---

## 📋 Liste complète des endpoints

### 🔐 Authentication

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| POST | /register | Créer un compte | nom, email, mot_de_passe |
| POST | /login | Se connecter | email, mot_de_passe |
| GET | /login?email=xxx | Info utilisateur | - |
| GET | /register | Liste utilisateurs | - |
| DELETE | /register/:email | Supprimer utilisateur | - |

### 💰 Transactions

| Méthode | Endpoint | Description | Body/Query |
|---------|----------|-------------|------------|
| GET | /transactions?user_id=X | Liste transactions | user_id (query) |
| POST | /transactions | Créer transaction | id_user, id_categorie, titre, montant, date_transaction |
| DELETE | /transactions/:id?user_id=X | Supprimer transaction | user_id (query) |

### 📊 Catégories disponibles

**Catégories principales :**
- ID 1 : Revenus
- ID 2 : Dépenses

**Sous-catégories :**
- ID 1 : Salaire (revenu)
- ID 2 : Alimentation (dépense)
- ID 3 : Logement (dépense)
- ID 4 : Autre revenu
- ID 5 : Alimentation (courses)
- ID 6 : Shopping
- ID 7 : Autre dépense
- ID 8 : Logement (loyer)

---

## 🧪 Tests de validation

### ✅ Tests de succès

1. **Créer un utilisateur avec des données valides**
   - Email unique
   - Mot de passe ≥ 6 caractères
   - Résultat : 201 Created

2. **Créer une transaction valide**
   - Montant > 0
   - Date valide
   - Catégorie existante
   - Résultat : 201 Created

3. **Lister les transactions**
   - user_id existant
   - Résultat : 200 OK + array

### ❌ Tests d'erreur

1. **Email déjà existant**
   ```
   POST /register
   { "nom": "Test", "email": "existant@test.com", "mot_de_passe": "test" }
   ```
   Résultat attendu : 400 Bad Request

2. **Login avec mauvais mot de passe**
   ```
   POST /login
   { "email": "test@test.com", "mot_de_passe": "wrong" }
   ```
   Résultat attendu : 400 Bad Request

3. **Créer transaction sans champs requis**
   ```
   POST /transactions
   { "id_user": 1 }
   ```
   Résultat attendu : 400 Bad Request

4. **Supprimer transaction d'un autre utilisateur**
   ```
   DELETE /transactions/1?user_id=999
   ```
   Résultat attendu : 403 Forbidden

5. **Virement avec solde insuffisant**
   ```
   POST /virements
   { "from_user": 1, "to_user": 2, "montant": 99999 }
   ```
   Résultat attendu : 400 Bad Request

---

## 📝 Exemples de réponses

### Succès - Login
```json
{
  "user": {
    "id": 1,
    "nom": "Test User",
    "email": "test@novabank.com"
  },
  "token": "base64encodedtoken..."
}
```

### Succès - Liste transactions
```json
{
  "transactions": [
    {
      "id": 1,
      "id_user": 1,
      "titre": "Salaire",
      "montant": "2500.00",
      "date_transaction": "2025-12-01",
      "categorie": "Revenus",
      "categorie_type": "revenu",
      "sous_categorie": "Salaire"
    }
  ]
}
```

### Erreur - Validation
```json
{
  "error": "id_user, id_categorie, montant et date_transaction requis"
}
```

---

## 🚀 Ordre recommandé pour les tests

1. ✅ Health Check (`GET /`)
2. ✅ Register (`POST /register`)
3. ✅ Login (`POST /login`)
4. ✅ Create Transaction - Revenu (`POST /transactions`)
5. ✅ Create Transaction - Dépenses x3 (`POST /transactions`)
6. ✅ Get Transactions (`GET /transactions`)
7. ✅ Delete Transaction (`DELETE /transactions/:id`)
8. ✅ Transfer Between Users (`POST /virements`)
9. ✅ Get User Info (`GET /login?email=xxx`)
10. ✅ Delete User (`DELETE /register/:email`)

---

## 💡 Astuces Postman

### Sauvegarder les réponses
1. Envoyez une requête
2. Clic sur **Save Response**
3. **Save as Example**

### Tests automatiques
Ajoutez dans l'onglet **Tests** :
```javascript
// Vérifier le code de statut
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Vérifier la structure de la réponse
pm.test("Response has user", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('user');
});
```

### Variables automatiques
Dans **Tests** pour sauvegarder automatiquement :
```javascript
// Sauvegarder le user_id après login
var jsonData = pm.response.json();
pm.collectionVariables.set("user_id", jsonData.user.id);
```

---

## 🔧 Dépannage

**Erreur de connexion :**
- Vérifiez que le serveur backend tourne (`node server.js`)
- Vérifiez l'URL : http://localhost:3000

**Erreur 500 :**
- Vérifiez que MySQL est démarré
- Vérifiez les logs du serveur backend

**Erreur 400 :**
- Vérifiez les champs requis dans le body
- Vérifiez le format JSON

---

✅ **Collection prête à l'emploi !**

Importez le fichier `NovaBank_API.postman_collection.json` dans Postman et commencez vos tests ! 🚀
