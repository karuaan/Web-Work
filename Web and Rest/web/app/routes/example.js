import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
  overdue: [],
  pending: [],
  completed: [],
  assignments: [],
  file: null,
  hdpi: 5, //to High and Picture becomes...jagged
  scale: 2, //relative to pdf size
  pdf: null,
  pages: [],
  pdfView: true,
  tableView: true,
  model: function() {
    let parent = this;

    Ember.run.schedule('afterRender', this, function() {
      parent.setActions();
    });
    let curr = new Date();

    let pendingAssigned = new Date();
    pendingAssigned.setDate(pendingAssigned.getDate() - 7);
    pendingAssigned = (pendingAssigned.getMonth() + 1) + '/' + pendingAssigned.getDate() + '/' + pendingAssigned.getFullYear();

    let pendingDue = new Date();
    pendingDue.setDate(pendingDue.getDate() + 7);
    pendingDue = (pendingDue.getMonth() + 1) + '/' + pendingDue.getDate() + '/' + pendingDue.getFullYear();

    let overdueAssigned = new Date();
    overdueAssigned.setDate(overdueAssigned.getDate() - 14);
    overdueAssigned = (overdueAssigned.getMonth() + 1) + '/' + overdueAssigned.getDate() + '/' + overdueAssigned.getFullYear();

    let overdueDue = new Date();
    overdueDue.setDate(overdueDue.getDate() - 7);
    overdueDue = (overdueDue.getMonth() + 1) + '/' + overdueDue.getDate() + '/' + overdueDue.getFullYear();

    let completedAssigned = new Date();
    completedAssigned.setDate(completedAssigned.getDate() - 10);
    completedAssigned = (completedAssigned.getMonth() + 1) + '/' + completedAssigned.getDate() + '/' + completedAssigned.getFullYear();

    let completedDue = new Date();
    completedDue.setDate(completedDue.getDate() + 4);
    completedDue = (completedDue.getMonth() + 1) + '/' + completedDue.getDate() + '/' + completedDue.getFullYear();

    let assignments = [{
        "id": 1,
        "title": "Foreword",
        "assigned": completedAssigned,
        "due": completedDue,
        "completed": curr,
        "status": "completed",
        "file": "Foreword.pdf"
    }, {
        "id": 2,
        "title": "Preface",
        "assigned": completedAssigned,
        "due": completedDue,
        "completed": curr,
        "status": "completed",
        "file": "Preface.pdf"
    }, {
        "id": 3,
        "title": "NEII Safety Committee",
        "assigned": completedAssigned,
        "due": completedDue,
        "completed": curr,
        "status": "completed",
        "file": "NEII SAFETY COMMITTEE.pdf"
    }, {
        "id": 4,
        "title": "Index",
        "assigned": completedAssigned,
        "due": completedDue,
        "completed": curr,
        "status": "completed",
        "file": "Index.pdf"
    }, {
        "id": 5,
        "title": "Section 1",
        "assigned": completedAssigned,
        "due": completedDue,
        "completed": curr,
        "status": "completed",
        "file": "Section 1.pdf"
    }, {
        "id": 6,
        "title": "Section 2",
        "assigned": completedAssigned,
        "due": completedDue,
        "completed": curr,
        "status": "completed",
        "file": "Section 2.pdf"
    }, {
        "id": 7,
        "title": "Section 3",
        "assigned": completedAssigned,
        "due": completedDue,
        "completed": curr,
        "status": "completed",
        "file": "Foreword.pdf"
    }, {
        "id": 8,
        "title": "Section 4",
        "assigned": completedAssigned,
        "due": completedDue,
        "completed": curr,
        "status": "completed",
        "file": "Foreword.pdf"
    }, {
        "id": 9,
        "title": "Section 5",
        "assigned": completedAssigned,
        "due": completedDue,
        "completed": curr,
        "status": "completed",
        "file": "Foreword.pdf"
    }, {
        "id": 10,
        "title": "Section 6",
        "assigned": pendingAssigned,
        "due": pendingDue,
        "completed": null,
        "status": "pending",
        "file": "Foreword.pdf"
    }, {
        "id": 11,
        "title": "Section 7",
        "assigned": pendingAssigned,
        "due": pendingDue,
        "completed": null,
        "status": "pending",
        "file": "Foreword.pdf"
    }, {
        "id": 12,
        "title": "Section 8",
        "assigned": pendingAssigned,
        "due": pendingDue,
        "completed": null,
        "status": "pending",
        "file": "Foreword.pdf"
    }, {
        "id": 13,
        "title": "Section 9",
        "assigned": pendingAssigned,
        "due": pendingDue,
        "completed": null,
        "status": "pending",
        "file": "Foreword.pdf"
    }, {
        "id": 14,
        "title": "Section 10",
        "assigned": pendingAssigned,
        "due": pendingDue,
        "completed": null,
        "status": "pending",
        "file": "Foreword.pdf"
    }, {
        "id": 15,
        "title": "Section 11",
        "assigned": pendingAssigned,
        "due": pendingDue,
        "completed": null,
        "status": "pending",
        "file": "Foreword.pdf"
    }, {
        "id": 16,
        "title": "Section 12",
        "assigned": pendingAssigned,
        "due": pendingDue,
        "completed": null,
        "status": "pending",
        "file": "Foreword.pdf"
    }, {
        "id": 17,
        "title": "Section 13",
        "assigned": pendingAssigned,
        "due": pendingDue,
        "completed": null,
        "status": "pending",
        "file": "Foreword.pdf"
    }, {
        "id": 18,
        "title": "Section 14",
        "assigned": pendingAssigned,
        "due": pendingDue,
        "completed": null,
        "status": "pending",
        "file": "Foreword.pdf"
    }, {
        "id": 19,
        "title": "Section 15",
        "assigned": overdueAssigned,
        "due": overdueDue,
        "completed": null,
        "status": "overdue",
        "file": "Foreword.pdf"
    }, {
        "id": 20,
        "title": "Section 16",
        "assigned": overdueAssigned,
        "due": overdueDue,
        "completed": null,
        "status": "overdue",
        "file": "Foreword.pdf"
    }, {
        "id": 21,
        "title": "Section 17",
        "assigned": overdueAssigned,
        "due": overdueDue,
        "completed": null,
        "status": "overdue",
        "file": "Foreword.pdf"
    }, {
        "id": 22,
        "title": "Section 18",
        "assigned": overdueAssigned,
        "due": overdueDue,
        "completed": null,
        "status": "overdue",
        "file": "Foreword.pdf"
    }, {
        "id": 23,
        "title": "Section 19",
        "assigned": overdueAssigned,
        "due": overdueDue,
        "completed": null,
        "status": "overdue",
        "file": "Foreword.pdf"
    }, {
        "id": 24,
        "title": "Section 20",
        "assigned": overdueAssigned,
        "due": overdueDue,
        "completed": null,
        "status": "overdue",
        "file": "Foreword.pdf"
    }, {
        "id": 25,
        "title": "Section 21",
        "assigned": overdueAssigned,
        "due": overdueDue,
        "completed": null,
        "status": "overdue",
        "file": "Foreword.pdf"
    }, {
        "id": 26,
        "title": "Section 22",
        "assigned": overdueAssigned,
        "due": overdueDue,
        "completed": null,
        "status": "overdue",
        "file": "Foreword.pdf"
    }, {
        "id": 27,
        "title": "Glossary",
        "assigned": overdueAssigned,
        "due": overdueDue,
        "completed": null,
        "status": "overdue",
        "file": "Foreword.pdf"
    }];
    this.set('assignments', assignments);
    this.update();
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
      /*
      var imgData = canvas.toDataURL('image/png');
      var doc = new jsPDF('p', 'pt', [0.75 * canvas.height, 0.75 * canvas.width]);
      doc.addImage(imgData, 'PNG', 0, 0);
      doc.save('test.pdf');
      console.log('render');
      */
      /*
      console.log('hidden rendered');
      var imgData = canvas.toDataURL('image/png');
      var doc = new jsPDF();
      var img = new Image();
      img.src = imgData;
      img.onload = function() {
        doc.addImage(img, 'PNG', 0, 0);
        //doc.save('test.pdf');
      };
      */
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
        /*
        pdf.getData().then(function(arrayBuffer) {
          parent.arrayBufferToString(arrayBuffer);
        });
        */
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

    var tableHide = document.getElementById('table-handle');
    Ember.Logger.log(tableHide);
    tableHide.addEventListener('click', function() {
      parent.toggleView(true, false);
    });
    var pdfHide = document.getElementById('pdf-toggle');
    pdfHide.addEventListener('click', function() {
      parent.toggleView(false, true);
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
    console.log('assignments');
    if(this.get('controller')) {
      this.get('controller').set('file', this.get('file'));
      this.get('controller').set('assignments', this.get('assignments'));
    }
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('file', this.get('file'));
    this.get('controller').set('assignments', this.get('assignments'));
  },
  toggleView: function(table, pdf) {
    var tableContainer = document.getElementById('table-container');
    var pdfContainer = document.getElementById('pdf-container');
    var pdfHide = document.getElementById('pdf-toggle');
    if(table) {
      if(this.get('tableView')) {
        this.set('tableView', false);
        tableContainer.style.display = 'none';
        pdfContainer.style.width = '100%';
        pdfContainer.style.marginLeft = '0%';
      } else {
        this.set('tableView', true);
        tableContainer.style.display = 'block';
        tableContainer.style.width = '40%';
        pdfContainer.style.width = '60%';
        pdfContainer.style.marginLeft = '40%';
      }
    } else if(pdf) {
      if(this.get('pdfView')) {
        this.set('pdfView', false);
        pdfContainer.style.display = 'none';
        tableContainer.style.width = '100%';
        pdfHide.style.transform = "rotate(180deg)";
      } else {
        this.set('pdfView', true);
        tableContainer.style.width = '40%';
        pdfContainer.style.display = 'block';
        pdfContainer.style.width = '60%';
        pdfContainer.style.marginLeft = '40%';
        pdfHide.style.transform = "rotate(0deg)";
      }
    }
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
    setPDF: function(id) {
      document.getElementById('viewer').innerHTML = '';
      document.getElementById('hiddenContainer').innerHTML = '';
      var toggle = document.getElementById('pdf-toggle');
      var tableContainer = document.getElementById('table-container');
      var pdfContainer = document.getElementById('pdf-container');
      toggle.style.display = 'block';
      tableContainer.style.width = '40%';
      pdfContainer.style.display = 'block';
      pdfContainer.style.width = '60%';
      pdfContainer.style.marginLeft = '40%';
      toggle.style.transform = "rotate(0deg)";
      var assignments = this.get('assignments');
      var file;
      for(let i = 0; i < assignments.length; i++) {
        if(assignments[i].id === id) {
          Ember.Logger.log(assignments[i].file);
          file = assignments[i].title;
        }
      }
      console.log('get pdf');
      this.get('store').findRecord('pdf', file).then(function(result) {
        console.log('got record');
        console.log(result);
      });
      var url = 'http://localhost:4200/pdfs?id=' + file;
      var parent = this;
      var doc = new jsPDF();
      PDFJS.getDocument(url).then(function(pdf) {
        var pageNumber = 1;
        parent.set('pdf', pdf);
        for(let i = 1; i <= pdf.numPages; i++) {
          pdf.getPage(i).then(function(page) {
            parent.renderPage(page, i);
          });
        }
      });
    }
  }
});
