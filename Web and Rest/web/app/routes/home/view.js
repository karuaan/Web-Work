import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
  file: null,
  hdpi: 5, //to High and Picture becomes...jagged
  scale: 1, //relative to pdf size
  pdf: null,
  pages: [],
  pageCount: 0,
  model: function() {
    var parent = this;
    var doc = new jsPDF();
    /* PDF Loaded */
    PDFJS.getDocument('http://localhost:4200/pdfs?id=Index').then(function(pdf) {
      /*
      var pageNumber = 1;
      parent.set('pdf', pdf);
      parent.set('pageCount', pdf.numPages);
      for(let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(function(page) {
          parent.renderPage(page, i);
        });
      }
      */

      document.getElementById('table-toggle').style.display = 'block';
      /* or id */
      document.getElementById('table-view-head-title').value = 'Index';
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

    Ember.run.schedule('afterRender', this, function() {
      parent.setActions();
    });
  },
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
      var page = parseInt(pageNumber.value);
      if(page > 2) {
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
  arrayBufferToString: function(buffer) {
    var binary = '';
    for(let i = 0; i < buffer.length; i++) {
      binary += buffer[i];
    }
    var enc = new TextDecoder();
    var data = enc.decode(buffer);
    var string = "";
    string += data;


    $.ajax({
      type: 'PUT',
      url: 'http://localhost:4200/pdfs/test?data=' + buffer,
      data: data,
      success: function(data) {
      }
    });

  },
  update: function() {
    if(this.get('controller')) {
      this.get('controller').set('file', this.get('file'));
    }
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('file', this.get('file'));

    /* set lessons replace with ajax call */
    let lessons = [];
    lessons.push({
      'name': 'lesson 1',
      'start': 1,
      'end': 3
    });
    lessons.push({
      'name': 'lesson 2',
      'start': 4,
      'end': 5
    });
    controller.set('lessons', lessons);
    this.set('lessons', lessons);

    let parent = this;
    Ember.run.schedule('afterRender', this, function() {
      parent.displayLessons();
    });
  },
  displayLessons: function() {
    let lessons = this.get('lessons');
    for(let i = 0; i < lessons.length; i++) {
      this.createLesson(lessons[i]);
    }
  },
  createLesson: function(lesson) {
    var table = document.getElementById('table-body');
    var row = document.createElement('tr');
    var data = document.createElement('td');
    var input = document.createElement('input');
    var ref = input;
    input.type = "text";
    input.style.width = "100%";
    input.className += "input-table";
    input.value = lesson.name;
    data.appendChild(input);
    row.appendChild(data);

    data = document.createElement('td');
    input = document.createElement('input');
    input.type = "number";
    input.min = "1";
    input.max = this.get("pageCount");
    input.style.width = "100%";
    input.className += "input-table";
    input.value = lesson.start;
    data.appendChild(input);
    row.appendChild(data);

    data = document.createElement('td');
    input = document.createElement('input');
    input.type = "number";
    input.min = "1";
    input.max = this.get("pageCount");
    input.style.width = "100%";
    input.className += "input-table";
    input.value = lesson.end;
    data.appendChild(input);
    row.appendChild(data);

    let parent = this;
    data = document.createElement('td');
    data.className += "lesson-close-td";
    input = document.createElement('div');
    input.className += "lesson-close";
    data.appendChild(input);
    data.addEventListener('click', function() {
      parent.send('deleteLesson', data);
    });
    row.appendChild(data);

    table.appendChild(row);
    ref.focus();
    return true;
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

      let parent = this;
      data = document.createElement('td');
      data.className += "lesson-close-td";
      input = document.createElement('div');
      input.className += "lesson-close";
      data.appendChild(input);
      data.addEventListener('click', function() {
        parent.send('deleteLesson', data);
      });
      row.appendChild(data);

      table.appendChild(row);
      ref.focus();
      return true;
    },
    deleteLesson: function(element) {
      element = element.parentNode;
      element.parentNode.removeChild(element);
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
          console.log(pageProxy);

          lessons.push(lesson);
        }

      }

      console.log('lessons');
      console.log(lessons);
      for(let i = 0; i < lessons.length; i++) {
        console.log(lessons[i]);
        Ember.$.ajax('http://localhost:3000/postlesson', {
          "type": 'POST', // HTTP method
          "crossDomain":true,
          "data": { // Begin data payload
            "name": lessons[i].title,
            "start_page": lessons[i].start,
            "end_page": lessons[i].end,
            "pages": lessons[i].pages,
          },
        }).then(function(resolve) {
          // to do list
          // change the response
          //   window.console.log("succes"+resolve['groups']);
        }).then(function(reject){
        });
      }
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
