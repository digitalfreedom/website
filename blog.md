---
layout: default
title: Blog
permalink: /blog/
---

<div>

  <h1>Posts</h1>

  <div>
    {% for post in site.posts %}
      <h2><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h2>
      <div>{{ post.date | date: "%b %-d, %Y" }}</div>
    {% endfor %}
  </div>

  <p>subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS</a></p>

</div>
