import Ember from 'ember';

export default Ember.Controller.extend({
  hdpi: 5, //to High and Picture becomes...jagged
  scale: 2, //relative to pdf size
  pages: [],
  pageCount: 0,
  lessons: null,
  bookPDF: null,
  pdf: null,
  renderPage: function(page, index) {
    console.log('renderPage');
    var scale = this.get('scale');
    var hdpi = this.get('hdpi');

    var viewport = page.getViewport(hdpi);
    var scaleport = page.getViewport(scale);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var div = document.createElement('div');
    div.className += "page";
    div.setAttribute('data-page-number', index);
    div.style.height = (16 + scaleport.height) + 'px';
    div.style.width = (16 + scaleport.width) + 'px';

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    canvas.id = 'page' + index;

    var wrapper = document.getElementById('viewer');
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    div.appendChild(canvas);
    wrapper.appendChild(div);

    var renderTask = page.render(renderContext);
    renderTask.then(function() {
    });

    this.renderHiddenPage(page, index);
  },
  renderHiddenPage: function(page, index) {
    var wrapper = document.getElementById('hiddenContainer');
    var canvas = document.createElement('canvas');
    var viewport = page.getViewport(this.get('hdpi'));
    var ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.display = 'none';

    wrapper.appendChild(canvas);

    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    }

    var pages = this.get('pages');
    pages.push(canvas);
    this.set('pages', pages);
    var renderTask = page.render(renderContext);
    renderTask.then(function() {
      console.log('render hidden');
    });
  },
  setActions: function() {
    var parent = this;

    var zoomIn = document.getElementById('zoomIn');
    zoomIn.addEventListener('click', function() {
      var scale = parent.get('scale');
      if(scale < 5) {
        scale += 0.25;
        Ember.Logger.log('scaling to: ' + scale);
        parent.set('scale', scale);
        var pdf = parent.get('pdf');
        var pages = document.getElementsByClassName('page');
        for(let i = 0; i < pages.length; i++) {
          pdf.getPage(i + 1).then(function(page) {
            var scaleport = page.getViewport(scale);
            pages[i].style.height = (16 + scaleport.height) + 'px';
            pages[i].style.width = (16 + scaleport.width) + 'px';
          });
        }
      }
    });

    var zoomOut = document.getElementById('zoomOut');
    zoomOut.addEventListener('click', function() {
      var scale = parent.get('scale');
      if(scale > 0.5) {
        scale -= 0.25;
        parent.set('scale', scale);
        var pdf = parent.get('pdf');
        var pages = document.getElementsByClassName('page');
        for(let i = 0; i < pages.length; i++) {
          pdf.getPage(i + 1).then(function(page) {
            var scaleport = page.getViewport(scale);
            pages[i].style.height = (16 + scaleport.height) + 'px';
            pages[i].style.width = (16 + scaleport.width) + 'px';
          });
        }
      }
    });

    var pageNumber = document.getElementById('pageNumber');
    pageNumber.addEventListener('keyup', function(event) {
      event.preventDefault();
      if(event.keyCode === 13) {
        var element = document.getElementById("page" + pageNumber.value).parentNode;
        if(element) {
          var topPos = element.offsetTop;
          document.getElementById('viewerContainer').scrollTop = topPos;
        }
      }
    });

    var previousePage = document.getElementById("previous");
    previousePage.addEventListener('click', function() {
      Ember.Logger.log('clicked previous');
      var page = parseInt(pageNumber.value);
      if(page > 1) {
        pageNumber.value = page - 1;
      } else {
        pageNumber.value = 1;
      }
      var element = document.getElementById("page" + pageNumber.value).parentNode;
      if(element) {
        var topPos = element.offsetTop;
        document.getElementById('viewerContainer').scrollTop = topPos;
      }
    });
    var nextPage = document.getElementById("next");
    nextPage.addEventListener('click', function() {
      Ember.Logger.log('clicked next');
      var page = parseInt(pageNumber.value);
      if(page < parent.get('pageCount')) {
        pageNumber.value = page + 1;
      } else {
        pageNumber.value = parent.get('pageCount');
      }
      var element = document.getElementById("page" + pageNumber.value).parentNode;
      if(element) {
        var topPos = element.offsetTop;
        document.getElementById('viewerContainer').scrollTop = topPos;
      }
    });
  },
  actions: {
		onLessonSelect: function(lessonId) {
			let lessons = this.get('lessons');
			let lesson;
			for(let i = 0; i < lessons.length; i++) {
        console.log(lessons[i].id + " : " + lessonId);
				if(lessons[i].id + "" === lessonId + "") {
          console.log('select');
					lesson = lessons[i];
          break;
				}
			}

      this.set("pageCount", 1 + (lesson.end - lesson.start));

      console.log('selected: ' + lessonId);
      console.log(this.get('lessons'));


      let parent = this;

      console.log(this.get('bookPDF'));
      PDFJS.getDocument(this.get('bookPDF')).then(function(pdf) {
        parent.set('pdf', pdf);
        document.getElementById('table-toggle').style.display = 'block';
        //document.getElementById('table-view-head-title').value = file.name;
        //document.getElementById('table-view').style.display = 'block';
        parent.set('pages', []);
        var pages = parent.get('pages');
        document.getElementById('viewer').innerHTML = '';
        document.getElementById('hiddenContainer').innerHTML = '';
        document.getElementById("pageNumber").value = '1';
        var pdfContainer = document.getElementById('pdf-container');
        var tableContainer = document.getElementById('table-container');
        pdfContainer.style.width = '50%';
        pdfContainer.style.marginLeft = '50%';
        tableContainer.style.width = '50%';
        let pageNumber = 1;
        for(let i = 1; i <= pdf.numPages; i++) {
          console.log(lesson);
          if(i >= lesson.start && i <= lesson.end) {
            pdf.getPage(i).then(function(page) {
              pages.push(page);
              parent.set('pages', pages);
              parent.renderPage(page, pageNumber);
              pageNumber++;
            });
          }
        }
      });
		},
    toggleTable: function() {
      Ember.Logger.log('toggle table');
      if(document.getElementById('table-container').style.width === "0%") {
        document.getElementById('table-container').style.width = "50%";
        document.getElementById('pdf-container').style.width = "50%";
        document.getElementById('pdf-container').style.marginLeft = "50%";
      } else {
        document.getElementById('table-container').style.width = "0%";
        document.getElementById('pdf-container').style.width = "100%";
        document.getElementById('pdf-container').style.marginLeft = "0%";
      }
    },
    togglePdf: function() {
      Ember.Logger.log('toggle pdf');
      if(document.getElementById('pdf-container').style.width === "0%") {
        document.getElementById('pdf-container').style.width = "50%";
        document.getElementById('table-container').style.width = "50%";
      } else {
        document.getElementById('pdf-container').style.width = "0%";
        document.getElementById('table-container').style.width = "100%";
      }
    }
	}
});
