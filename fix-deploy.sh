#!/bin/bash

# 1. Garantir que a pasta public existe
mkdir -p public
touch public/.gitkeep

# 2. Verificar se pages e styles existem
mkdir -p pages styles

# 3. Corrigir o import do CSS no _app.js (se necessário)
if [ -f "pages/_app.js" ]; then
    sed -i.bak "s|import '../styles/globals.css'|import '../styles/globals.css'|g" pages/_app.js
    rm -f pages/_app.js.bak
fi

# 4. Commit e push
git add .
git commit -m "fix: corrigir estrutura para deploy no Vercel"
git push

echo "✅ Correções aplicadas! Aguarde o deploy no Vercel."
