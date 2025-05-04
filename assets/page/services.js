var baseimage = '/assets/images/portfolio/';
var link = '/pages/';

var $services = [
      {
            "id": "counseling",
            "link": `${link}counseling.html`,
            "title": "مشاوره",
            'location': "Online",
            "category": "طراح و توسعه دهنده وب،مشاور اجرای نرم افزار",
            'name': "سجاد محمدی نژاد",
            'date': "1398 فروردین",
            'img': baseimage + "counseling/hero.webp",
      },
      {
            "id": "nestjs",
            "link": `${link}nestjs.html`,
            "title": "آموزش مقدماتی",
            'location': "Online",
            "category": "آموزش مقدماتی طراحی و پیاده سازی بک اند با نست جی ای",
            'name': "سجاد محمدی نژاد",
            'date': "1398 فروردین",
            'img': baseimage + "nestjs/hero.png",
      },
      {
            "id": "nestjs-microservice",
            "link": `${link}nestjs-microservice.html`,
            "title": "آموزش پیشرفته",
            'location': "Online",
            "category": "آموزش پیشرفته طراحی و پیاده سازی بک اند با نست جی ای",
            'name': "سجاد محمدی نژاد",
            'date': "1398 فروردین",
            'img': baseimage + "nestjs/hero2.jpg",
      },
      
      
];
function servicesFun(id) {
      var html = document.getElementById(id)
  
      for ($social of $services) {
            html.innerHTML += ` 
                <div class="col-lg-4 col-md-6 mt-4 pt-2">
                    <div class="work-container position-relative d-block overflow-hidden rounded"> 
                        <a  class="d-inline-block image-box" href="${$social.link}" title="">
                            <img src="${$social.img}" class="img-fluid rounded img" alt="work-image">
                            <div class="overlay-work"></div>
                        </a>
                        <div class="content personal-port">
                        <!-- target=”_blank” --> 
                            <a   href="${$social.link}" class="title text-white d-block font-weight-bold"> ${$social.title}</a>
                            <small class="text-light">${$social.category}</small>
                        </div>
                        <div class="client personal-port">
                            <small class="text-light user d-block">
                                <i class="mdi mdi-account"></i>
                                ${$social.name}
                            </small>
                            <small class="text-light date">
                                <i class="mdi mdi-calendar-check"></i>
                                ${$social.date}
                            </small>
                        </div>
                    </div>
                </div>
    
           `
      }
}
(function () {
      servicesFun('servicesRow')
})()