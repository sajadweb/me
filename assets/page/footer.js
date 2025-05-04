(function () {
      var $sociallinks = [
            { "name": "اینستاگرام", 'icon': "mdi mdi-instagram", 'link': "https://www.instagram.com/sajadweb" },
            { "name": "توییتر", 'icon': "mdi mdi-twitter", 'link': "https://www.twitter.com/sajadweb" },
            { "name": "اسکایپ", 'icon': "mdi mdi-skype", 'link': "https://www.skype.com/sajadweb" },

            { "name": "گیت هاب", 'icon': "mdi mdi-git", 'link': "https://www.github.com/sajadweb" },
            { "name": "لینکدین", 'icon': "mdi mdi-linkedin", 'link': "https://www.linkedin.com/in/sajadweb" },

      ];
      var html = document.getElementById('ul')
      for (const $social of $sociallinks) {

            html.innerHTML += `   
                        <li class="list-inline-item mb-0">
                              <a href="${$social.link}" class="rounded">
                                    <i class="${$social.icon}" title="${$social.name}"></i></a>
                        </li>
`

      }

})()