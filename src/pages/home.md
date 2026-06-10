---
layout: "default"
lang: "ja"
permalink: "/"
type: "home"
---

<div>
  <h1>{{ site.title }}</h1>
  <p>やっほー！</p>
</div>

{% if collections.notes | length > 0 %}
<section>
  <h2>ノート</h2>

  {% for note in collections.notes %}
  <article>
    <a href="{{ note.url }}">
      <h3>{{ note.data.title | escape }}</h3>
      <time datetime="{{ note.data.date | dateISO }}">
        {{ note.data.date | date }}
      </time>
    </a>
  </article>
  {% endfor %}

</section>
{% endif %}
