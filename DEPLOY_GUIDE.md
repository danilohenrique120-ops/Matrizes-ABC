# Guia Rápido de Publicação: GitHub + Vercel + Firebase (Tempo Real)

Este guia contém o passo a passo direto para colocar o **BMS Pilar CD** online na Vercel com sincronização de banco de dados em tempo real para múltiplos usuários.

---

## 1. Criar e Configurar o Firebase (Banco de Dados em Tempo Real)

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e clique em **Criar Projeto**.
2. Dê um nome (ex: `bms-pilar-cd`) e conclua a criação.
3. No menu lateral, acesse **Build > Firestore Database** e clique em **Criar Banco de Dados**:
   - Selecione o local (ex: `southamerica-east1` em São Paulo ou `us-central1`).
   - Em **Regras**, inicie no modo de teste ou configure as regras abaixo.
4. Na aba **Regras** do Firestore, cole o conteúdo do arquivo `firestore.rules`:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /wcm_plants/{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   Clique em **Publicar**.
5. No menu da engrenagem no topo esquerdo, clique em **Configurações do Projeto > Geral**.
6. Role até **Seus aplicativos**, clique no ícone Web (`</>`), registre o app e copie as chaves geradas.

---

## 2. Subir o Código no GitHub

1. Crie um novo repositório vazio no [GitHub](https://github.com/new) (ex: `bms-pilar-cd`).
2. No seu computador, dentro da pasta do projeto, abra o terminal e execute:
   ```bash
   git init
   git add .
   git commit -m "feat: release BMS Pilar CD pronto para Vercel"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/bms-pilar-cd.git
   git push -u origin main
   ```

---

## 3. Publicar na Vercel

1. Acesse a [Vercel](https://vercel.com/) e conecte com seu GitHub.
2. Clique em **Add New... > Project** e selecione o repositório `bms-pilar-cd`.
3. A Vercel detecta automaticamente o **Vite**:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Na seção **Environment Variables**, adicione as chaves copiadas do Firebase:
   - `VITE_FIREBASE_API_KEY`: sua chave de API
   - `VITE_FIREBASE_AUTH_DOMAIN`: `seu-projeto.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID`: `seu-projeto`
   - `VITE_FIREBASE_STORAGE_BUCKET`: `seu-projeto.firebasestorage.app`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: seu ID de remetente
   - `VITE_FIREBASE_APP_ID`: seu App ID
5. Clique em **Deploy**.

---

## 4. Testando o Tempo Real Multi-usuário

- Abra o link gerado pela Vercel em duas abas ou em dispositivos diferentes (ex: computador e celular).
- Cadastre uma perda na Matriz A ou altere uma causa na Matriz B/C em um dispositivo.
- O outro dispositivo atualizará os dados e o gráfico de Pareto instantaneamente sem precisar recarregar a tela!
