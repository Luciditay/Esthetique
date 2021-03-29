var gui = new dat.GUI();
var params = {
    mode: 0,
    nbreRayons: 492,
    seed: 0,
    courbure: 8,
    longueurRayons: 10,
    Download_Image: function () { return save(); },
};
gui.add(params, "mode", 0, 1, 1);
gui.add(params, "seed", 0, 100, 1);
gui.add(params, "nbreRayons", 0, 500, 1);
var courbure = gui.add(params, "courbure", 0, 50, 1);
gui.add(params, "Download_Image");
function courbeHorizontal(x0, y0, x1, y1, pasX) {
    var coeffDirecteur = (y1 - y0) / (x1 - x0);
    noiseSeed(random(1000));
    beginShape();
    var start = 0;
    var i = x0;
    if (pasX == 1) {
        while (i <= x1) {
            var t = noise(start);
            var yMap = map(t, 0, 1, -params.courbure, params.courbure);
            curveVertex(i, coeffDirecteur * i + yMap);
            start += random() / 5;
            i++;
        }
    }
    else {
        while (i >= x1) {
            var t = noise(start);
            var yMap = map(t, 0, 1, -params.courbure, params.courbure);
            curveVertex(i, coeffDirecteur * i + yMap);
            start += random() / 5;
            i--;
        }
    }
    endShape();
}
function courbeVertical(x0, y0, x1, y1, pasY) {
    var coeffDirecteur = (x1 - x0) / (y1 - y0);
    noiseSeed(random(1000));
    beginShape();
    var start = 0;
    var i = y0;
    if (pasY == 1) {
        while (i <= y1) {
            var t = noise(start);
            var yMap = map(t, 0, 1, -params.courbure, params.courbure);
            curveVertex(coeffDirecteur * i + yMap, i);
            start += random() / 5;
            i++;
        }
    }
    else {
        while (i >= y1) {
            var t = noise(start);
            var yMap = map(t, 0, 1, -params.courbure, params.courbure);
            curveVertex(coeffDirecteur * i + yMap, i);
            start += random() / 5;
            i--;
        }
    }
    endShape();
}
function draw() {
    randomSeed(params.seed);
    var xCenter = width / 2;
    var yCenter = height / 2;
    var xRect = 200;
    var yRect = 200;
    var nbreRayons = params.nbreRayons;
    var colors = ['red', 'blue', 'yellow', 'purple'];
    var ESPACEMENT = 5;
    background(255);
    push();
    translate(xCenter, yCenter);
    var v1 = createVector(1, 0);
    var hauteur = 0.90 * height / 2;
    var largeur = 0.90 * width / 2;
    var Nord = createVector(0, -hauteur);
    var Est = createVector(largeur, 0);
    var Sud = createVector(0, hauteur);
    var Ouest = createVector(-largeur, 0);
    for (var i = 0; i < nbreRayons / 2; i++) {
        var angle = (PI / nbreRayons);
        var c1 = cos(angle);
        var s1 = sin(angle);
        stroke(random(colors));
        var x1 = v1.x;
        var y1 = v1.y;
        v1.x = x1 * c1 - y1 * s1;
        v1.y = s1 * x1 + c1 * y1;
        var xPiL = -xRect / 2;
        var yPiL = (v1.y * xRect / 2) / v1.x;
        var xPiH = -(v1.x * yRect / 2) / (v1.y);
        var yPiH = -yRect / 2;
        var xDecalage = random(-10, 11) * 1;
        var yDecalage = random(-10, 11) * 1;
        var xDecalage2 = random(-10, 11) * 1;
        var yDecalage2 = random(-10, 11) * 1;
        var t = (-largeur * hauteur) / (hauteur * x1 + largeur * y1);
        var xNO = x1 * t;
        var yNO = y1 * t;
        if (params.mode == 1) {
            if (yPiL >= -yRect / 2 && yPiL <= yRect / 2) {
                courbeHorizontal(xPiL + xDecalage, yPiL + yDecalage, xNO + xDecalage2, -yNO + yDecalage2, -1);
                courbeHorizontal(xPiL + xDecalage, -yPiL + yDecalage, xNO + xDecalage2, yNO + yDecalage2, -1);
                courbeHorizontal(-xPiL + xDecalage, -yPiL + yDecalage, -xNO + xDecalage2, yNO + yDecalage2, 1);
                courbeHorizontal(-xPiL + xDecalage, yPiL + yDecalage, -xNO + xDecalage2, -yNO + yDecalage2, 1);
            }
            else {
                courbeVertical(xPiH + xDecalage, yPiH + yDecalage, xNO + xDecalage2, yNO + yDecalage2, -1);
                courbeVertical(-xPiH + xDecalage, yPiH + yDecalage, -xNO + xDecalage2, yNO + yDecalage2, -1);
                courbeVertical(-xPiH + xDecalage, -yPiH + yDecalage, -xNO + xDecalage2, -yNO + yDecalage2, 1);
                courbeVertical(xPiH + xDecalage, -yPiH + yDecalage, xNO + xDecalage2, -yNO + yDecalage2, 1);
            }
        }
        else {
            if (yPiL >= -yRect / 2 && yPiL <= yRect / 2) {
                line(xPiL + xDecalage, yPiL + yDecalage, xNO + xDecalage2, -yNO + yDecalage2);
                line(xPiL + xDecalage, -yPiL + yDecalage, xNO + xDecalage2, yNO + yDecalage2);
                line(-xPiL + xDecalage, -yPiL + yDecalage, -xNO + xDecalage2, yNO + yDecalage2);
                line(-xPiL + xDecalage, yPiL + yDecalage, -xNO + xDecalage2, -yNO + yDecalage2);
            }
            else {
                line(xPiH + xDecalage, yPiH + yDecalage, xNO + xDecalage2, yNO + yDecalage2);
                line(-xPiH + xDecalage, yPiH + yDecalage, -xNO + xDecalage2, yNO + yDecalage2);
                line(-xPiH + xDecalage, -yPiH + yDecalage, -xNO + xDecalage2, -yNO + yDecalage2);
                line(xPiH + xDecalage, -yPiH + yDecalage, xNO + xDecalage2, -yNO + yDecalage2);
            }
        }
    }
    pop();
}
function setup() {
    p6_CreateCanvas();
}
function windowResized() {
    p6_ResizeCanvas();
}
var __ASPECT_RATIO = 2 / 3;
var __MARGIN_SIZE = 25;
function __desiredCanvasWidth() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return windowWidth - __MARGIN_SIZE * 2;
    }
    else {
        return __desiredCanvasHeight() * __ASPECT_RATIO;
    }
}
function __desiredCanvasHeight() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return __desiredCanvasWidth() / __ASPECT_RATIO;
    }
    else {
        return windowHeight - __MARGIN_SIZE * 2;
    }
}
var __canvas;
function __centerCanvas() {
    __canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
function p6_CreateCanvas() {
    __canvas = createCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
function p6_ResizeCanvas() {
    resizeCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
var p6_SaveImageSequence = function (durationInFrames, fileExtension) {
    if (frameCount <= durationInFrames) {
        noLoop();
        var filename_1 = nf(frameCount - 1, ceil(log(durationInFrames) / log(10)));
        var mimeType = (function () {
            switch (fileExtension) {
                case 'png':
                    return 'image/png';
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
            }
        })();
        __canvas.elt.toBlob(function (blob) {
            p5.prototype.downloadFile(blob, filename_1, fileExtension);
            setTimeout(function () { return loop(); }, 100);
        }, mimeType);
    }
};
//# sourceMappingURL=../src/src/build.js.map