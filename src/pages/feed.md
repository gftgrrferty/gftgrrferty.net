---
layout: "default"
lang: "ja"
permalink: "/feed/"
type: "home"
---

{% if collections.notes | length > 0 %}
<section>
  {% for note in collections.notes %}
  <article>
    <a href="{{ note.url }}" target="_blank">
      <h3>{{ note.data.title | escape }}</h3>
      <time datetime="{{ note.data.date | dateISO }}">
        {{ note.data.date | date }}
      </time>
    </a>
  </article>
  {% endfor %}

</section>
{% endif %}
