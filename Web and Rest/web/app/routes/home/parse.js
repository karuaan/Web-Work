import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
  hdpi: 5, //to High and Picture becomes...jagged
  scale: 2, //relative to pdf size
  pages: [],
  pageCount: 0,
  pdf: null,
  lessons: null,
  renderPage: function(page, index) {
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
    select: function() {
      let zoom = document.getElementById('scaleSelect').value;
      let parent = this;

      if(zoom === 'page-actual') {
        parent.set('scale', 1);
        var scale = parent.get('scale');
        var pdf = parent.get('pdf');
        var pages = document.getElementsByClassName('page');
        for(let i = 0; i < pages.length; i++) {
          pdf.getPage(i + 1).then(function(page) {
            var scaleport = page.getViewport(scale);
            pages[i].style.height = (16 + scaleport.height) + 'px';
            pages[i].style.width = (16 + scaleport.width) + 'px';
          });
        }
      } else if (zoom === 'auto') {

      } else {
        zoom = parseFloat(zoom);
        parent.set('scale', zoom);
        Ember.Logger.log(zoom);
        var scale = parent.get('scale');
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
    },
    createLesson: function() {
      var table = document.getElementById('table-body');
      var row = document.createElement('tr');
      var data = document.createElement('td');
      var input = document.createElement('input');
      var ref = input;
      input.type = "text";
      input.style.width = "100%";
      input.className += "input-table";
      data.appendChild(input);
      row.appendChild(data);

      data = document.createElement('td');
      input = document.createElement('input');
      input.type = "number";
      input.min = "1";
      input.max = this.get("pageCount");
      input.style.width = "100%";
      input.className += "input-table";
      data.appendChild(input);
      row.appendChild(data);

      data = document.createElement('td');
      input = document.createElement('input');
      input.type = "number";
      input.min = "1";
      input.max = this.get("pageCount");
      input.style.width = "100%";
      input.className += "input-table";
      data.appendChild(input);
      row.appendChild(data);

      table.appendChild(row);
      ref.focus();
    },
    chooseFiles: function() {
      document.getElementById('file-chooser').click();
    },
    selectFile: function() {
      let parent = this;
      var file = document.getElementById('file-chooser').files[0];
      var fileReader = new FileReader();
      fileReader.onload = function() {
        var arraybuffer = this.result;
        var uint8array = new Uint8Array(arraybuffer);
        PDFJS.getDocument(uint8array).then(function(pdf) {
          document.getElementById('table-toggle').style.display = 'block';
          document.getElementById('table-view-head-title').value = file.name;
          document.getElementById('table-view').style.display = 'block';
          parent.set('pages', []);
          parent.set('pageCount', 0);
          var pages = parent.get('pages');
          parent.set('pageCount', pdf.numPages);
          document.getElementById('viewer').innerHTML = '';
          document.getElementById('hiddenContainer').innerHTML = '';
          var pdfContainer = document.getElementById('pdf-container');
          var tableContainer = document.getElementById('table-container');
          pdfContainer.style.width = '50%';
          pdfContainer.style.marginLeft = '50%';
          tableContainer.style.width = '50%';
          parent.set('pdf', pdf);
          for(let i = 1; i <= pdf.numPages; i++) {
            pdf.getPage(i).then(function(page) {
              pages.push(page);
              parent.set('pages', pages);
              parent.renderPage(page, i);
            });
          }
        });
      };
      fileReader.readAsArrayBuffer(file);
      parent.setActions();
    },
    dropped: function(data) {
      console.log('dropped');
      console.log(data);
    },
    saveLessons: function() {
      var book;
      var lessons = [];
      var inputs = document.getElementsByClassName('input-table');
      if(inputs.length <= 1) {
        console.log('no lessons added');
      } else {
        book = inputs[1].value;
        for(let i = 1; i < inputs.length; i++) {
          var lesson = {};
          lesson.title = inputs[i].value;
          i++;
          lesson.start = inputs[i].value;
          i++;
          lesson.end = inputs[i].value;

          var pages = this.get('pages');
          var pageProxy = [];
          for(let j = 0; j < pages.length; j++) {
            if(pages[j].pageIndex !== null && pages[j].pageIndex !== undefined) {
              if(j >= lesson.start && j <= lesson.end) {
                pageProxy.push(pages[i]);
              }
            }
          }

          lesson.pages = pageProxy;
          /* Page Proxy Index is all pdf data parsed by page */
          //console.log(pageProxy);

          /* Page PRoxy is Pages, lesson is object */
          lessons.push(lesson);
        }
        self.set('lessons', lessons);
		//console.log(lessons);
      }
	  var formData = new FormData();
	  formData.append('book_name', 'TEST_BOOK1');
	  formData.append('book_file', this.get('pdf'));
	  var xhr = new XMLHttpRequest();
	  
	  xhr.open('POST', 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/new/book', true);
	  xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	  xhr.onload = function(){
		  if(xhr.status === 200){
			  console.log('success!!!');
		  }
		  else{
			  console.log('errrrrrr');
		  }
	  }
	  xhr.send(this.get('pdf'));
		/*
      Ember.$.ajax('http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/postbook', {
        "type": 'POST', // HTTP method
        "crossDomain":true,
        "data": { // Begin data payload
          "pages": this.get('pdf')
        },
      }).then(function(resolve) {
        let id = resolve.id;

        for(let i = 0; i < lessons.length; i++) {
          console.log(lessons[i]);
          Ember.$.ajax('http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/postlesson', {
            "type": 'POST', // HTTP method
            "crossDomain":true,
            "data": { // Begin data payload
              "name": lessons[i].title,
              "start_page": lessons[i].start,
              "end_page": lessons[i].end,
              "pages": lessons[i].pages,
              "bookId": id,
            },
          }).then(function(resolve) {
            // to do list
            // change the response
            //   window.console.log("succes"+resolve['groups']);
          }).then(function(reject){
          });
        }
        // to do list
        // change the response
        //   window.console.log("succes"+resolve['groups']);
      }).then(function(reject){
      });*/
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
