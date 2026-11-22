---
layout: "default"
lang: "ja"
permalink: "/feed/"
---

<div class="works-head">
  <h2>ノート</h2>
  <p class="page-lead">活動記録</p>
</div>

{% if collections.notes | length > 0 %}
<section>
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
