---
layout: post
title: Create github webpage
---

Create your github webpage, if not already, using following git commands
```bash
git init
git add .
git commit -m "Initial Jekyll site"
git branch -M main
git remote add origin https://github.com/basilkottilingal/basilkottilingal.github.io.git
git push -u origin main
```

### Jekyl website

A blog like page is implemented using jekyll.

| Folder  File     | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `_config.yml` | Global site settings, options, metadata          |
| `_layouts/`   | HTML templates that pages/posts use              |
| `_posts/*`     | Blog articles (Markdown), auto-handled by Jekyll |

### Test webpage locally

You may test the webpage locally by installing jekyll and bundler
```bash
gem install jekyll bundler
jekyll new basilkottilingal.github.io
cd basilkottilingal.github.io
```

Inside the repo
```bash
bundle init
bundle add jekyll
bundle install
bundle exec jekyll serve
```

Now open the page `http://localhost:4000`

### Install Jekyll using rbenv

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
Open the page in a browser:

```
http://localhost:4000
```

### Beautifying your webpage using [Hyde](https://hyde.getpoole.com/)

Hyde is a brazen two-column [Jekyll](http://jekyllrb.com) theme that pairs a
prominent sidebar with uncomplicated content. It's based on [Poole](http://getpoole.com), the Jekyll butler.
Poole is the Jekyll Butler, serving as an upstanding and effective
foundation for Jekyll themes by [@mdo](https://twitter.com/mdo).
