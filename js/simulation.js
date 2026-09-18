// Canvas Setup
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
let animationId;

// Simulation State
let blocks = [];
let edges = [];
let phase = 0; // 0: Idle, 1: Animating, 2: Settled

function resizeCanvas() {
    // Get parent width properly considering padding
    const wrapper = canvas.parentElement;
    canvas.width = wrapper.clientWidth;
    canvas.height = 500;
    if(phase === 0) drawIdleState();
}

window.addEventListener('resize', resizeCanvas);

// Helper: Wrap Text for Canvas
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            context.fillText(line, x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, currentY);
}

function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle, lineWidth = 2) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    if (fillStyle) { ctx.fillStyle = fillStyle; ctx.fill(); }
    if (strokeStyle) { ctx.lineWidth = lineWidth; ctx.strokeStyle = strokeStyle; ctx.stroke(); }
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

function drawIdleState() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText("Simülasyon alanı. İşlemi başlatmak için 'Simüle Et' butonuna tıklayın.", canvas.width/2, canvas.height/2);
    ctx.textAlign = 'left';
}

function setStatus(text, dotColor) {
    document.getElementById('statusText').textContent = text;
    const dot = document.getElementById('statusDot');
    dot.style.background = dotColor;
    if(dotColor === '#f59e0b') { // amber
        dot.classList.add('pulse');
    } else {
        dot.classList.remove('pulse');
    }
}

function setLog(htmlMsg) {
    document.getElementById('simLog').innerHTML = `> ${htmlMsg}`;
}

// --- Core Simulation Logic ---
function startSimulation() {
    if(animationId) cancelAnimationFrame(animationId);
    
    const rawText = document.getElementById('labText').value;
    const strategy = document.getElementById('strategySelect').value;
    
    blocks = [];
    edges = [];
    phase = 1;
    
    setStatus("İŞLENİYOR...", "#f59e0b");
    
    // 1. Orijinal Metin Bloğu (Başlangıç)
    blocks.push({
        id: 'source',
        text: rawText,
        type: 'source',
        x: canvas.width / 2 - 250, y: canvas.height / 2 - 60,
        w: 500, h: 120,
        targetX: canvas.width / 2 - 250, targetY: 40, // Yukarı hareket edecek
        opacity: 1, targetOpacity: 0.1, // Soluklaşacak
        fill: 'rgba(30, 41, 59, 0.9)',
        stroke: 'rgba(100, 116, 139, 0.5)',
        isWarning: false
    });

    // 2. Stratejiye Göre Mantıksal Bölme
    let generatedChunks = [];
    let logMsg = "";

    if(strategy === 'fixed') {
        const words = rawText.split(' ');
        const chunkSize = 12; // Sabit kelime sınırı
        for(let i=0; i<words.length; i+=chunkSize) {
            let chunkText = words.slice(i, i+chunkSize).join(' ');
            let hasCut = !chunkText.endsWith('.') && !chunkText.endsWith('!');
            generatedChunks.push({ text: chunkText, isWarning: hasCut });
        }
        logMsg = "Sabit boyutlu kesim uygulandı. <span style='color: #f43f5e;'>Kırmızı kenarlıklı bloklar, cümlenin anlamsızca tam ortadan bölündüğü (bağlam kaybı yaşanan) yerleri gösterir. Yapay zeka '10.000 TL'nin ne cezası olduğunu anlayamayacaktır.</span>";
    } 
    else if (strategy === 'semantic') {
        let sentences = rawText.match(/[^.!?]+[.!?]+/g) || [rawText];
        sentences.forEach(s => {
            generatedChunks.push({ text: s.trim(), isWarning: false });
        });
        logMsg = "Anlamsal sınır (cümle bitişleri) kullanılarak bölündü. <span style='color: #10b981;'>Yeşil kenarlıklı bloklar, anlam bütünlüğünün tam olarak korunduğunu gösterir. Yapay zeka maddeyi bütün olarak okuyup kusursuz cevap verecektir.</span>";
    }
    else if (strategy === 'hierarchical') {
        let sentences = rawText.match(/[^.!?]+[.!?]+/g) || [rawText];
        
        // Parent Block
        blocks.push({
            id: 'parent',
            text: "[PARENT (TÜM SAYFA BAĞLAMI)]\n" + rawText.substring(0, 120) + "...",
            type: 'parent',
            x: canvas.width / 2 - 200, y: 50,
            w: 400, h: 80,
            targetX: canvas.width / 2 - 200, targetY: 50,
            opacity: 0, targetOpacity: 1,
            fill: 'rgba(15, 23, 42, 0.9)',
            stroke: 'rgba(99, 102, 241, 0.8)',
            isWarning: false
        });

        sentences.forEach((s, idx) => {
            generatedChunks.push({ id: `child_${idx}`, text: s.trim(), isWarning: false, isChild: true });
        });
        logMsg = "Hiyerarşik (Parent-Child) yapı kuruldu. <span style='color: #818cf8;'>Aşağıdaki küçük parçalar (Child) arama motoruna gider, ancak arama motoru bulduğunda yapay zekaya yukarıdaki büyük gövde (Parent) verilir.</span>";
    }

    // 3. Bölünen Parçaların Canvas Objelerini Oluşturma (Hedef Koordinatlar)
    const cols = 3;
    const blockW = 200;
    const blockH = 120;
    const gapX = 30;
    const gapY = 30;
    
    let startRowY = strategy === 'hierarchical' ? 180 : 180;
    
    // Satır sayısına göre başlangıç X pozisyonunu ortala
    let actualCols = Math.min(cols, generatedChunks.length);
    let totalW = actualCols * blockW + (actualCols - 1) * gapX;
    let startX = (canvas.width - totalW) / 2;

    generatedChunks.forEach((chunk, i) => {
        let row = Math.floor(i / cols);
        let col = i % cols;
        
        // Son satırda kalan eleman sayısına göre ortalama (opsiyonel, şimdilik basit sola dayalı ızgara merkezde)
        let tx = startX + col * (blockW + gapX);
        let ty = startRowY + row * (blockH + gapY);

        let strokeColor = 'rgba(71, 85, 105, 0.8)'; // default
        if(strategy === 'fixed' && chunk.isWarning) strokeColor = '#f43f5e'; // rose
        if(strategy === 'semantic') strokeColor = '#10b981'; // emerald
        if(strategy === 'hierarchical') strokeColor = '#60a5fa'; // sky blue

        let blockObj = {
            id: chunk.id || `chunk_${i}`,
            text: chunk.text,
            type: chunk.isChild ? 'child' : 'chunk',
            x: canvas.width / 2 - blockW/2,
            y: canvas.height / 2 - blockH/2,
            w: blockW,
            h: blockH,
            targetX: tx, targetY: ty,
            opacity: 0, targetOpacity: 1,
            fill: 'rgba(15, 23, 42, 0.95)',
            stroke: strokeColor,
            isWarning: chunk.isWarning
        };
        blocks.push(blockObj);

        if(chunk.isChild) {
            edges.push({ from: 'parent', to: blockObj.id, progress: 0 });
        }
    });

    setLog(logMsg);
    animate();
}

// --- Animation Loop ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allSettled = true;

    // Draw Edges (Hiyerarşik bağlantılar)
    edges.forEach(edge => {
        let parent = blocks.find(b => b.id === edge.from);
        let child = blocks.find(b => b.id === edge.to);
        
        if(parent && child && parent.opacity > 0.5) {
            edge.progress = lerp(edge.progress, 1, 0.05);
            
            ctx.beginPath();
            ctx.moveTo(parent.x + parent.w/2, parent.y + parent.h);
            
            let cp1y = parent.y + parent.h + 30;
            let cp2y = child.y - 30;
            
            ctx.bezierCurveTo(
                parent.x + parent.w/2, cp1y,
                child.x + child.w/2, cp2y,
                child.x + child.w/2, child.y
            );
            
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.5 * edge.progress})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    });

    // Draw Blocks
    blocks.forEach(block => {
        if(phase === 1) {
            block.x = lerp(block.x, block.targetX, 0.06);
            block.y = lerp(block.y, block.targetY, 0.06);
            block.opacity = lerp(block.opacity, block.targetOpacity, 0.06);
            
            if(Math.abs(block.x - block.targetX) > 1 || Math.abs(block.y - block.targetY) > 1) {
                allSettled = false;
            }
        }

        if(block.opacity < 0.05) return;

        ctx.globalAlpha = block.opacity;
        
        drawRoundedRect(ctx, block.x, block.y, block.w, block.h, 8, block.fill, block.stroke, block.isWarning ? 3 : 2);

        ctx.textBaseline = 'top';
        const pad = 16;
        
        if(block.type === 'source') {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '13px Inter';
            wrapText(ctx, block.text, block.x + pad, block.y + pad, block.w - pad*2, 20);
        } else {
            // Header
            ctx.fillStyle = block.stroke;
            ctx.font = 'bold 10px JetBrains Mono';
            let header = block.type === 'parent' ? '[PARENT]' : '[CHUNK]';
            if(block.isWarning) header += ' ⚠️ HATA: BÖLÜNDÜ';
            ctx.fillText(header, block.x + pad, block.y + 10);
            
            // Body
            ctx.fillStyle = '#cbd5e1';
            ctx.font = '12px Inter';
            wrapText(ctx, block.text, block.x + pad, block.y + 30, block.w - pad*2, 18);
        }
        
        ctx.globalAlpha = 1;
    });

    if(phase === 1 && allSettled) {
        phase = 2;
        setStatus("TAMAMLANDI", "#10b981");
    }

    animationId = requestAnimationFrame(animate);
}

// Init
window.onload = () => {
    setTimeout(resizeCanvas, 100);
};
