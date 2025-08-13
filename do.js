var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var maxSize;
var imgName;
var image = new Image;
var upload;
var input = document.getElementsByTagName('input');
for (var i = 0; i < input.length; i++) {
    (function(i) {
        id = input[i].id;
        input[i].onchange = function(ev) {
            loadImage()
        }
    })(i);
    if (2 <= i && i <= 6) {
        let label = document.getElementsByTagName('label');
        let node = document.createElement("span");
        node.innerHTML = input[i].value;
        node.id = input[i].id + "-span";
        node.className = 'badge rounded-pill bg-info ms-1';
        label[i].appendChild(node)
    }
};

// Add event listener for textarea (content field)
var contentTextarea = document.getElementById('content');
if (contentTextarea && contentTextarea.tagName === 'TEXTAREA') {
    contentTextarea.onchange = function() {
        loadImage();
    };
    contentTextarea.oninput = function() {
        loadImage();
    };
}

function loadImage() {
    for (var x of input) {
        if (document.getElementById(x.id + "-span")) {
            document.getElementById(x.id + "-span").innerHTML = x.value
        }
    };
    if (!document.getElementById('upload').files.length) {
        return
    } else {
        upload = window.URL.createObjectURL(document.getElementById('upload').files[0]);
        imgName = document.getElementById('upload').files[0].name;
        image.src = upload;
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            maxSize = Math.max(image.height, image.width);
            canvas.style.height = (image.height / image.width) * 100 + '%';
            ctx.restore();
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            ctx.fillStyle = document.getElementById('color').value;
            ctx.globalAlpha = document.getElementById('alpha').value / 100;
            var size = (document.getElementById('size').value * maxSize / 100);
            ctx.font = size + 'px "' + document.getElementById('font').value + '"';
            ctx.textBaseline = 'middle';
            var rot = document.getElementById('rotate').value;
            ctx.rotate(rot * Math.PI / 180);
            var gap = size * document.getElementById('gap').value / 100;
            var content = document.getElementById('content').value;
            if (!content.length) return;
            
            // Split content into lines and handle multi-line text
            var lines = content.split('\n');
            var lineHeight = size * 1.2; // 20% line spacing
            var totalTextHeight = lines.length * lineHeight;
            
            // Calculate the maximum width of all lines for proper spacing
            var maxTextWidth = 0;
            for (var i = 0; i < lines.length; i++) {
                var lineWidth = ctx.measureText(lines[i]).width;
                if (lineWidth > maxTextWidth) {
                    maxTextWidth = lineWidth;
                }
            }
            
            var limit = Math.sqrt(2 * (maxSize * maxSize));
            
            // Draw the multi-line watermark pattern
            for (var h = -maxSize - totalTextHeight, even = false; h <= limit; h += totalTextHeight + gap, even = !even) {
                for (var v = -maxSize - (even ? maxTextWidth / 2 : 0); v <= limit + (even ? maxTextWidth / 2 : 0); v += maxTextWidth + size) {
                    // Draw each line of the multi-line text
                    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                        if (lines[lineIndex].trim()) { // Only draw non-empty lines
                            ctx.fillText(lines[lineIndex], v, h + (lineIndex * lineHeight));
                        }
                    }
                }
            }
            
            can2jpg(canvas)
        }
    }
};

function can2jpg(canvas) {
    var jpg = new Image();
    jpg.src = canvas.toDataURL("image/jpeg");
    jpg.alt = imgName;
    jpg.onload = function() {
        document.getElementById("preview-img").src = jpg.src;
        document.getElementById("preview-img").alt = jpg.alt;
        document.getElementById("preview-img").style = null;
        document.getElementById("download").href = jpg.src;
        document.getElementById("download").alt = jpg.alt
    }
};