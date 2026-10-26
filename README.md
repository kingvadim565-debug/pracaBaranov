# PracaPlus – школьный проект (Nikita Baranov)

Сайт с вакансиями на HTML + CSS + JS: поиск, категории, фильтр по городу, сортировка, форма отклика. После отправки формы на email кандидата уходит письмо «заявка на рассмотрении, ответ в течение пары дней». Письма идут через Brevo, деплой на Vercel, **без собственного домена** (используется бесплатный адрес `*.vercel.app`).

## Структура

```
index.html      – страница
style.css       – стили
script.js       – вакансии, поиск/фильтры, форма
api/apply.js    – serverless-функция (отправка письма через Brevo)
.env.example    – какие переменные нужны
```

> У Никиты должны быть **свои** аккаунты: GitHub, Vercel (войти через GitHub) и Brevo.

## 1. Brevo (бесплатно, 300 писем/день)

Домена нет, поэтому отправителем будет обычный email (например, Gmail Никиты). DNS-записи добавлять не нужно.

1. Регистрация на brevo.com. Подтвердить телефон (плашка **Verify now** сверху).
2. Меню аккаунта справа вверху → **Senders, domains, IPs → Senders → Add a sender**. Имя: `PracaPlus`, адрес: email Никиты. Brevo пришлёт письмо со ссылкой, **подтверди её**. Статус должен стать **Verified**.
3. Меню аккаунта → **SMTP & API → API Keys → Generate a new API key**:
   - Access: **Restricted**
   - **Transactional email = All**, всё остальное None
   - ключ сразу скопируй (второй раз его не покажут)
4. **Security → Authorized IPs**: должно быть `API keys: Deactivated`. Если включено, выключи, иначе Vercel получит ошибку 401.

⚠️ Ключ API это как пароль: не отправляй его в чаты и не выкладывай на GitHub.

## 2. GitHub

Создай на GitHub **пустой** репозиторий (без README) под своим аккаунтом и залей проект:

```
git init
git add .
git commit -m "First deploy"
git branch -M main
git remote add origin https://github.com/ИМЯ/НАЗВАНИЕ.git
git push -u origin main
```

Если push даёт 403, значит, Git залогинен под другим аккаунтом: `gh auth login` и `gh auth switch`, либо удалить сохранённый вход GitHub в «Диспетчере учётных данных» Windows.

## 3. Vercel

1. vercel.com → **Add New → Project** → выбрать репозиторий.
2. Project Name: маленькие буквы и дефисы (например `pracaplus-nikita`). Если имя занято, добавь цифры. Application Preset: **Other**. Root Directory: `./`
3. Environment Variables (можно сразу при создании или потом в **Settings → Environment Variables**). Названия писать **точно так**, без опечаток:
   - `BREVO_API_KEY` = ключ из Brevo
   - `BREVO_SENDER_EMAIL` = тот же email, что подтверждён в Brevo как отправитель
   - `BREVO_SENDER_NAME` = `PracaPlus` (необязательно)
   - `ADMIN_EMAIL` = email, куда придёт копия заявки (необязательно)
   - Environment: **Production**
4. **Deploy**. Если переменные добавлял уже после деплоя: **Deployments → три точки → Redeploy** (без этого они не подхватываются).

Адрес сайта будет вида `https://pracaplus-nikita.vercel.app`. Его можно показать учителю.

## 4. Тест

Открой сайт, нажми «Aplikuj», отправь заявку на свой email и проверь входящие **и спам**.

Если не работает:
- «Serwer nie jest poprawnie skonfigurowany» → в Vercel нет `BREVO_API_KEY` или `BREVO_SENDER_EMAIL` (проверь написание) либо не сделан Redeploy. В **Vercel → Logs** будет написано, какой переменной не хватает.
- «Nie udało się wysłać e-maila» → смотри Brevo → **Transactional → Logs**. Частые причины: отправитель не подтверждён, ключ с неправильными правами, включена блокировка IP.
- Письмо в спаме → нормально для отправки с Gmail через Brevo (нет своего домена и DKIM). Для школьного показа это ок, просто покажи письмо из папки «Спам».

## Что рассказать учителю

- Фронтенд на чистых HTML, CSS и JS, без фреймворков.
- Бэкенд: одна serverless-функция, ключ API лежит в переменных окружения, а не в коде.
- Защита: валидация на клиенте и на сервере, экранирование HTML в письме, honeypot против ботов.
