var ProcessControls = require('./control-section.js').ProcessControls;

var PreviewControls = function(cubeMarch, renderer, ractive) {
    ProcessControls.call(this, ractive);
    this.renderer = renderer;
    this.cubeMarch = cubeMarch;
};

PreviewControls.prototype = Object.create(ProcessControls.prototype);
PreviewControls.prototype.constructor = PreviewControls;
PreviewControls.prototype.namespace = 'preview';

PreviewControls.prototype.update = function(data) {
    if ( ! data) {
        return;
    }
    this.renderer.addSection(data.vertices, data.faces);
};

PreviewControls.prototype.start = function() {
    ProcessControls.prototype.start.call(this);
    this.cubeMarch.abort();
    var dd = parseInt(this.ractive.get('preview.resolution'), 10);
    var bounds = this.ractive.get('bounds');
    this.cubeMarch.setVolume([dd, dd, dd], bounds);
    this.renderer.startModel();
    this.cubeMarch.march({
        onSection: this.update.bind(this),
        onProgress: this.progress.bind(this),
        onDone: this.done.bind(this)
    });
};

PreviewControls.prototype.cancel =function() {
    this.parent.cancel.call(this);
    this.cubeMarch.abort();
};

module.exports = PreviewControls;