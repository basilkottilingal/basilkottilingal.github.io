
# Create github webpage

Create the github webpage, if not already, like
```bash
git init
git add .
git commit -m "Initial Jekyll site"
git branch -M main
git remote add origin https://github.com/basilkottilingal/basilkottilingal.github.io.git
git push -u origin main
```

# Jekyl website

A blog like jekyll page is implemented.

| Folder  File     | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `_config.yml` | Global site settings, options, metadata          |
| `_layouts/`   | HTML templates that pages/posts use              |
| `_posts/*`     | Blog articles (Markdown), auto-handled by Jekyll |

# Test webpage locally

Install jekyll and bundler
```bash
gem install jekyll bundler
jekyll new username.github.io
cd username
```

Inside the repo
```bash
bundle init
bundle add jekyll
bundle install
```

Initialize jekyll server
```bash
bundle exec jekyll serve
```

Now open the page `http://localhost:4000`

## Install Jekyll using rbenv

In case system Ruby (installed via APT package manager) conflicts with Bundler gems,
you can install Jekyll using rbenv.

Install dependencies
```bash
sudo apt update
sudo apt install -y build-essential git ruby-dev libffi-dev libxml2-dev libxslt-dev zlib1g-dev
```

Install rbenv (isolated Ruby, no conflicts with APT)
```bash
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc
source ~/.bashrc
```

Install ruby-build
```bash
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
```

Install a fresh Ruby (no APT conflicts)
```bash
rbenv install 3.3.0
rbenv global 3.3.0
```

Install Jekyll and Bundler
```bash
gem install bundler jekyll
rbenv rehash
```

Inside your repo:
```bash
bundle init  # if no Gemfile
bundle add jekyll
bundle install
bundle exec jekyll serve
```
Open in browser:

```
http://localhost:4000
```
