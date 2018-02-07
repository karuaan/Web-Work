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
    PDFJS.getDocument('http://localhost:4200/pdfs?id=Index').then(function(pdf) {
      var pageNumber = 1;
      parent.set('pdf', pdf);
      parent.set('pageCount', pdf.numPages);
      for(let i = 1; i <= pdf.numPages; i++) {
        pdf.getPage(i).then(function(page) {
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
  },
  actions: {
    dropped: function(data) {
    },
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
        parent.set('scale', zoom);
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
    }
  }
});
