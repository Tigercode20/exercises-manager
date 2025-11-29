const DAYS = 5;
let currentDay = 1;
let dayNames = {1:"Day 1",2:"Day 2",3:"Day 3",4:"Day 4",5:"Day 5"};
let exercises = [];
let editingIndex = -1;

const daysRow = document.getElementById("daysRow");
const currentDayLabel = document.getElementById("currentDayLabel");

// إنشاء كروت الأيام
function renderDays() {
    daysRow.innerHTML = "";
    for (let i = 1; i <= DAYS; i++) {
        const card = document.createElement("div");
        card.className = `day-card ${currentDay === i ? "active" : ""}`;

        const pill = document.createElement("div");
        pill.className = "day-pill";
        const input = document.createElement("input");
        input.value = dayNames[i];
        input.addEventListener("input", () => {
            dayNames[i] = input.value || `Day ${i}`;
            document.querySelectorAll(".day-card")[i-1].querySelector(".big").textContent = dayNames[i];
            if (currentDay === i) currentDayLabel.textContent = dayNames[i];
        });
        pill.appendChild(input);

        const main = document.createElement("div");
        main.className = "day-main";
        main.innerHTML = `<div class="big">${dayNames[i]}</div><div class="small">Day ${i}</div>`;

        card.appendChild(pill);
        card.appendChild(main);
        card.onclick = (e) => { if (e.target !== input) setCurrentDay(i); };
        daysRow.appendChild(card);
    }
}

function setCurrentDay(day) {
    currentDay = day;
    currentDayLabel.textContent = dayNames[day];
    renderDays();
    renderExercises();
}

renderDays();

// تحديث قائمة التمارين
document.getElementById('exerciseType').addEventListener('change', updateExerciseNames);
function updateExerciseNames() {
    const type = document.getElementById('exerciseType').value;
    const select = document.getElementById('exerciseName');
    select.innerHTML = '';
    exercisesData[type]?.forEach(ex => {
        const opt = document.createElement('option');
        opt.value = ex.name;
        opt.textContent = ex.name;
        opt.dataset.link = ex.link || '';
        select.appendChild(opt);
    });
}

function addExercise() {
    const order = parseInt(document.getElementById('exerciseOrder').value);
    const type = document.getElementById('exerciseType').value;
    const nameSelect = document.getElementById('exerciseName');
    const name = nameSelect.value;
    const link = nameSelect.selectedOptions[0].dataset.link;
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const rest = document.getElementById('rest').value;

    if (exercises.some(e => e.day === currentDay && e.order === order)) {
        alert("الترتيب ده مستخدم بالفعل في اليوم ده!");
        return;
    }

    exercises.push({ order, day: currentDay, type, name, link, sets, reps, rest });
    renderExercises();
    resetForm();
}

function renderExercises() {
    const tbody = document.getElementById('exercisesBody');
    const dayEx = exercises.filter(e => e.day === currentDay).sort((a, b) => a.order - b.order);
    tbody.innerHTML = dayEx.length === 0 ? `<tr><td colspan="7" style="color:var(--accent-color);padding:30px;">لا توجد تمارين</td></tr>` : '';
    dayEx.forEach(ex => {
        const i = exercises.indexOf(ex);
        tbody.innerHTML += `
            <tr>
                <td>${ex.order}</td><td>${ex.type}</td><td>${ex.name}</td>
                <td>${ex.sets}</td><td>${ex.reps}</td><td>${ex.rest}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="editExercise(${i})">تعديل</button>
                    <button class="delete-btn" onclick="deleteExercise(${i})">حذف</button>
                    ${ex.link ? `<button class="view-btn" onclick="window.open('${ex.link}', '_blank')">عرض</button>` : ''}
                </td>
            </tr>`;
    });
}

function editExercise(i) {
    const ex = exercises[i];
    document.getElementById('exerciseOrder').value = ex.order;
    document.getElementById('exerciseType').value = ex.type;
    updateExerciseNames();
    setTimeout(() => document.getElementById('exerciseName').value = ex.name, 50);
    document.getElementById('sets').value = ex.sets;
    document.getElementById('reps').value = ex.reps;
    document.getElementById('rest').value = ex.rest;
    editingIndex = i;
    document.getElementById('addBtn').style.display = 'none';
    document.getElementById('updateBtn').style.display = 'block';
}

function updateExercise() {
    if (editingIndex === -1) return;

    const order = parseInt(document.getElementById('exerciseOrder').value);
    const type = document.getElementById('exerciseType').value;
    const nameSelect = document.getElementById('exerciseName');
    const name = nameSelect.value;
    const link = nameSelect.selectedOptions[0].dataset.link;
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const rest = document.getElementById('rest').value;

    if (exercises.some(e => e.day === currentDay && e.order === order && e !== exercises[editingIndex])) {
        alert("الترتيب ده مستخدم بالفعل في اليوم ده!");
        return;
    }

    exercises[editingIndex] = { order, day: currentDay, type, name, link, sets, reps, rest };
    renderExercises();
    resetForm();
    editingIndex = -1;
    document.getElementById('addBtn').style.display = 'block';
    document.getElementById('updateBtn').style.display = 'none';
}

function deleteExercise(i) {
    if (confirm("هل أنت متأكد؟")) {
        exercises.splice(i, 1);
        renderExercises();
    }
}

function resetForm() {
    document.getElementById('exerciseOrder').value = '1';
    document.getElementById('exerciseType').value = 'كارديو';
    updateExerciseNames();
    document.getElementById('sets').value = '3';
    document.getElementById('reps').value = '8-12';
    document.getElementById('rest').value = '1.5-2 min';
    editingIndex = -1;
    document.getElementById('addBtn').style.display = 'block';
    document.getElementById('updateBtn').style.display = 'none';
}

function applyColors() {
    const bg = document.getElementById('colorBg').value;
    const accent = document.getElementById('colorAccent').value;
    const text = document.getElementById('colorText').value;

    document.documentElement.style.setProperty('--bg-color', bg);
    document.documentElement.style.setProperty('--accent-color', accent);
    document.documentElement.style.setProperty('--text-color', text);

    localStorage.setItem('workoutColors', JSON.stringify({ bg, accent, text }));
}

function resetColors() {
    document.getElementById('colorBg').value = '#0a0f25';
    document.getElementById('colorAccent').value = '#ff6b35';
    document.getElementById('colorText').value = '#ffffff';
    applyColors();
}

function loadSavedColors() {
    const saved = localStorage.getItem('workoutColors');
    if (saved) {
        const { bg, accent, text } = JSON.parse(saved);
        document.getElementById('colorBg').value = bg;
        document.getElementById('colorAccent').value = accent;
        document.getElementById('colorText').value = text;
        applyColors();
    }
}

function showPreview() {
    const dayEx = exercises.filter(e => e.day === currentDay).sort((a, b) => a.order - b.order);
    if (dayEx.length === 0) {
        alert('لا توجد تمارين للمعاينة!');
        return;
    }

    document.getElementById('previewDayTitle').textContent = `Day ${currentDay}`;
    const tbody = document.getElementById('previewExercisesBody');
    tbody.innerHTML = '';
    dayEx.forEach((ex, i) => {
        const row = document.createElement('tr');
        if (i % 2 === 1) row.style.background = 'var(--input-bg-color)';
        row.innerHTML = `
            <td>${ex.order}</td>
            <td>${ex.link ? `<a href="${ex.link}" target="_blank">${ex.name}</a>` : ex.name}</td>
            <td>${ex.sets}</td>
            <td>${ex.reps}</td>
            <td>${ex.rest}</td>
        `;
        tbody.appendChild(row);
    });
    document.getElementById('previewModal').style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

function downloadCurrentDayPDF() {
    generatePDFForDay(currentDay);
}

function downloadAllDaysPDF() {
    const allDays = [...new Set(exercises.map(ex => ex.day))].sort((a, b) => a - b);
    if (allDays.length === 0) {
        alert('لا توجد تمارين!');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    const inputBgColor = getComputedStyle(document.documentElement).getPropertyValue('--input-bg-color').trim();

    const hexToRgb = hex => {
        hex = hex.replace('#', '');
        const bigint = parseInt(hex, 16);
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    };

    const accent = hexToRgb(accentColor);
    const text = hexToRgb(textColor);
    const bg = hexToRgb(bgColor);
    const inputBg = hexToRgb(inputBgColor);

    allDays.forEach((day, i) => {
        if (i > 0) pdf.addPage();

        const dayEx = exercises.filter(ex => ex.day === day).sort((a, b) => a.order - b.order);

        pdf.setFillColor(bg.r, bg.g, bg.b);
        pdf.rect(0, 0, 210, 297, 'F');

        pdf.setTextColor(accent.r, accent.g, accent.b);
        pdf.setFontSize(32);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Workout Program', 105, 35, { align: 'center' });

        pdf.setFontSize(24);
        pdf.setFillColor(accent.r, accent.g, accent.b);
        pdf.rect(65, 45, 80, 12, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.text(`Day ${day}`, 105, 53, { align: 'center' });

        let y = 70;
        pdf.setFillColor(accent.r, accent.g, accent.b);
        pdf.rect(15, y, 180, 12, 'F');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('#', 22, y + 8);
        pdf.text('Exercise Name', 105, y + 8, { align: 'center' });
        pdf.text('Sets', 135, y + 8, { align: 'center' });
        pdf.text('Reps', 160, y + 8, { align: 'center' });
        pdf.text('Rest', 185, y + 8, { align: 'center' });

        y += 18;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(text.r, text.g, text.b);

        dayEx.forEach((ex, j) => {
            const rowY = y + (j * 12);
            if (j % 2 === 1) {
                pdf.setFillColor(inputBg.r, inputBg.g, inputBg.b);
                pdf.rect(15, rowY - 8, 180, 11, 'F');
            }
            pdf.text(ex.order.toString(), 22, rowY);
            if (ex.link) {
                pdf.textWithLink(ex.name, 40, rowY, { url: ex.link });
                pdf.setTextColor(accent.r, accent.g, accent.b);
                pdf.text(ex.name, 40, rowY);
                pdf.setTextColor(text.r, text.g, text.b);
            } else {
                pdf.text(ex.name, 40, rowY);
            }
            pdf.text(ex.sets, 135, rowY, { align: 'center' });
            pdf.text(ex.reps, 160, rowY, { align: 'center' });
            pdf.text(ex.rest, 185, rowY, { align: 'center' });
        });
    });

    pdf.setFontSize(10);
    pdf.setTextColor(180, 180, 180);
    pdf.text('Created by Workout Program Builder Tool', 105, 290, { align: 'center' });

    pdf.save('Workout_Program_All_Days.pdf');
}

function generatePDFForDay(day) {
    const dayEx = exercises.filter(ex => ex.day === day).sort((a, b) => a.order - b.order);
    if (dayEx.length === 0) {
        alert('لا توجد تمارين في هذا اليوم!');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
    const inputBgColor = getComputedStyle(document.documentElement).getPropertyValue('--input-bg-color').trim();

    const hexToRgb = hex => {
        hex = hex.replace('#', '');
        const bigint = parseInt(hex, 16);
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    };

    const accent = hexToRgb(accentColor);
    const text = hexToRgb(textColor);
    const bg = hexToRgb(bgColor);
    const inputBg = hexToRgb(inputBgColor);

    pdf.setFillColor(bg.r, bg.g, bg.b);
    pdf.rect(0, 0, 210, 297, 'F');

    pdf.setTextColor(accent.r, accent.g, accent.b);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Workout Program', 105, 35, { align: 'center' });

    pdf.setFontSize(24);
    pdf.setFillColor(accent.r, accent.g, accent.b);
    pdf.rect(65, 45, 80, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Day ${day}`, 105, 53, { align: 'center' });

    let y = 70;
    pdf.setFillColor(accent.r, accent.g, accent.b);
    pdf.rect(15, y, 180, 12, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('#', 22, y + 8);
    pdf.text('Exercise Name', 105, y + 8, { align: 'center' });
    pdf.text('Sets', 135, y + 8, { align: 'center' });
    pdf.text('Reps', 160, y + 8, { align: 'center' });
    pdf.text('Rest', 185, y + 8, { align: 'center' });

    y += 18;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(text.r, text.g, text.b);

    dayEx.forEach((ex, i) => {
        const rowY = y + (i * 12);
        if (i % 2 === 1) {
            pdf.setFillColor(inputBg.r, inputBg.g, inputBg.b);
            pdf.rect(15, rowY - 8, 180, 11, 'F');
        }
        pdf.text(ex.order.toString(), 22, rowY);
        if (ex.link) {
            pdf.textWithLink(ex.name, 40, rowY, { url: ex.link });
            pdf.setTextColor(accent.r, accent.g, accent.b);
            pdf.text(ex.name, 40, rowY);
            pdf.setTextColor(text.r, text.g, text.b);
        } else {
            pdf.text(ex.name, 40, rowY);
        }
        pdf.text(ex.sets, 135, rowY, { align: 'center' });
        pdf.text(ex.reps, 160, rowY, { align: 'center' });
        pdf.text(ex.rest, 185, rowY, { align: 'center' });
    });

    pdf.setFontSize(10);
    pdf.setTextColor(180, 180, 180);
    pdf.text('Created by Workout Program Builder Tool', 105, 290, { align: 'center' });

    pdf.save(`Workout_Program_Day_${day}.pdf`);
}

function downloadImage() {
    const dayEx = exercises.filter(ex => ex.day === currentDay).sort((a, b) => a.order - b.order);
    if (dayEx.length === 0) {
        alert('لا توجد تمارين لتحميل الصورة!');
        return;
    }

    const printPage = document.getElementById('printPage');
    printPage.innerHTML = createPrintPage(currentDay, dayEx);

    printPage.style.display = 'block';
    printPage.style.width = '2480px';
    printPage.style.height = '3508px';
    printPage.style.padding = '80px';
    printPage.style.background = 'white';
    printPage.style.color = '#000';

    html2canvas(printPage, {
        scale: 1,
        width: 2480,
        height: 3508,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Workout_Program_Day_${currentDay}_A4.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        printPage.style.display = 'none';
        printPage.style.width = '';
        printPage.style.height = '';
        printPage.style.padding = '';
        printPage.style.background = '';
    });
}

function createPrintPage(currentDay, dayExercises) {
    return `
        <div class="print-page-header">
            <h1 class="print-page-title">Workout Program</h1>
            <div class="print-page-day">Day ${currentDay}</div>
        </div>
        <table class="print-table-pdf">
            <thead>
                <tr>
                    <th width="10%">#</th>
                    <th width="50%">Exercise Name</th>
                    <th width="15%">Sets</th>
                    <th width="15%">Reps</th>
                    <th width="10%">Rest</th>
                </tr>
            </thead>
            <tbody>
                ${dayExercises.map((ex, i) => `
                    <tr style="${i % 2 === 1 ? `background: var(--input-bg-color);` : ''}">
                        <td class="print-exercise-number">${ex.order}</td>
                        <td class="print-exercise-name">
                            ${ex.link ? `<a href="${ex.link}" target="_blank" class="exercise-link">${ex.name}</a>` : ex.name}
                        </td>
                        <td>${ex.sets}</td>
                        <td>${ex.reps}</td>
                        <td>${ex.rest}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div style="text-align:center; margin-top:20px; font-size:12px; color:#aaa;">
            Created by Workout Program Builder Tool
        </div>
    `;
}

// دمج PDF
async function mergePDFs() {
    const mainFile = document.getElementById('mainPDF').files[0];
    const insertFile = document.getElementById('insertPDF').files[0];
    const pageNum = parseInt(document.getElementById('pageNumber').value) - 1;
    const insertMode = document.getElementById('insertMode').value;
    const msg = document.getElementById('msg');

    if (!mainFile || !insertFile) {
        msg.textContent = 'يرجى اختيار كلا الملفين!';
        return;
    }

    msg.textContent = 'يتم الدمج...';

    try {
        const PDFLib = window.PDFLib;
        const mainBytes = await mainFile.arrayBuffer();
        const mainDoc = await PDFLib.PDFDocument.load(mainBytes);

        let insertDoc;
        if (insertFile.type.startsWith('image/')) {
            insertDoc = await PDFLib.PDFDocument.create();
            const page = insertDoc.addPage([mainDoc.getPage(0).getWidth(), mainDoc.getPage(0).getHeight()]);
            const imgBytes = await insertFile.arrayBuffer();
            let img;
            if (insertFile.type === 'image/jpeg') {
                img = await insertDoc.embedJpg(imgBytes);
            } else {
                img = await insertDoc.embedPng(imgBytes);
            }
            page.drawImage(img, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
        } else {
            const insertBytes = await insertFile.arrayBuffer();
            insertDoc = await PDFLib.PDFDocument.load(insertBytes);
        }

        const pagesToInsert = await mainDoc.copyPages(insertDoc, insertDoc.getPageIndices());

        if (insertMode === 'after') {
            let idx = pageNum + 1;
            for (let i = 0; i < pagesToInsert.length; i++) {
                mainDoc.insertPage(idx + i, pagesToInsert[i]);
            }
        } else if (insertMode === 'replace') {
            mainDoc.removePage(pageNum);
            for (let i = 0; i < pagesToInsert.length; i++) {
                mainDoc.insertPage(pageNum + i, pagesToInsert[i]);
            }
        }

        const mergedBytes = await mainDoc.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        document.getElementById('downloadLink').href = url;
        document.getElementById('downloadLink').download = 'HOME TRAINING PLAN.pdf';
        document.getElementById('downloadBtn').style.display = 'inline-block';

        msg.textContent = 'تم الدمج! اضغط على الزر للتحميل.';
    } catch (error) {
        msg.textContent = 'حدث خطأ أثناء الدمج: ' + error.message;
    }
}

function triggerDownload() {
    document.getElementById('downloadLink').click();
}

// حماية بسيطة
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))) {
        e.preventDefault();
    }
});

// تهيئة أولية
document.addEventListener('DOMContentLoaded', () => {
    updateExerciseNames();
    renderExercises();
    loadSavedColors();
});