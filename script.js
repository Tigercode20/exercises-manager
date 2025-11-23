let exercises = [];
let editingIndex = -1;

// تحديث قائمة التمارين عند تغيير نوع التمرين
document.getElementById('exerciseType').addEventListener('change', function() {
    updateExerciseNames();
});

function updateExerciseNames() {
    const exerciseType = document.getElementById('exerciseType').value;
    const exerciseNameSelect = document.getElementById('exerciseName');
    
    exerciseNameSelect.innerHTML = '';
    
    if (exercisesData[exerciseType]) {
        exercisesData[exerciseType].forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise.name;
            option.textContent = exercise.name;
            option.dataset.link = exercise.link;
            exerciseNameSelect.appendChild(option);
        });
    }
}

// تحديث عنوان اليوم
document.getElementById('daySelect').addEventListener('change', function() {
    document.getElementById('dayTitle').textContent = 'Day ' + this.value;
    renderExercises();
});

function addExercise() {
    const order = document.getElementById('exerciseOrder').value;
    const day = document.getElementById('daySelect').value;
    const type = document.getElementById('exerciseType').value;
    const nameSelect = document.getElementById('exerciseName');
    const name = nameSelect.value;
    const link = nameSelect.options[nameSelect.selectedIndex].dataset.link;
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const rest = document.getElementById('rest').value;

    // التحقق من عدم تكرار ترتيب التمرين في نفس اليوم
    const dayExercises = exercises.filter(ex => ex.day === parseInt(day));
    const existingOrder = dayExercises.find(ex => ex.order === parseInt(order));
    
    if (existingOrder) {
        alert('هذا الترتيب مستخدم بالفعل في هذا اليوم! الرجاء اختيار ترتيب آخر.');
        return;
    }

    const exercise = {
        order: parseInt(order),
        day: parseInt(day),
        type: type,
        name: name,
        link: link,
        sets: sets,
        reps: reps,
        rest: rest
    };

    exercises.push(exercise);
    renderExercises();
    resetForm();
}

function editExercise(index) {
    const exercise = exercises[index];
    
    document.getElementById('exerciseOrder').value = exercise.order;
    document.getElementById('daySelect').value = exercise.day;
    document.getElementById('exerciseType').value = exercise.type;
    updateExerciseNames();
    setTimeout(() => {
        document.getElementById('exerciseName').value = exercise.name;
    }, 100);
    document.getElementById('sets').value = exercise.sets;
    document.getElementById('reps').value = exercise.reps;
    document.getElementById('rest').value = exercise.rest;

    editingIndex = index;
    document.getElementById('addBtn').style.display = 'none';
    document.getElementById('updateBtn').style.display = 'block';
}

function updateExercise() {
    if (editingIndex === -1) return;

    const order = document.getElementById('exerciseOrder').value;
    const day = document.getElementById('daySelect').value;
    const type = document.getElementById('exerciseType').value;
    const nameSelect = document.getElementById('exerciseName');
    const name = nameSelect.value;
    const link = nameSelect.options[nameSelect.selectedIndex].dataset.link;
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const rest = document.getElementById('rest').value;

    // التحقق من عدم تكرار الترتيب (ما عدا التمرين الحالي)
    const dayExercises = exercises.filter(ex => ex.day === parseInt(day));
    const existingOrder = dayExercises.find(ex => ex.order === parseInt(order) && ex !== exercises[editingIndex]);
    
    if (existingOrder) {
        alert('هذا الترتيب مستخدم بالفعل في هذا اليوم! الرجاء اختيار ترتيب آخر.');
        return;
    }

    exercises[editingIndex] = {
        order: parseInt(order),
        day: parseInt(day),
        type: type,
        name: name,
        link: link,
        sets: sets,
        reps: reps,
        rest: rest
    };

    renderExercises();
    resetForm();
    editingIndex = -1;
    document.getElementById('addBtn').style.display = 'block';
    document.getElementById('updateBtn').style.display = 'none';
}

function deleteExercise(index) {
    if (confirm('هل تريد حذف هذا التمرين؟')) {
        exercises.splice(index, 1);
        renderExercises();
    }
}

function renderExercises() {
    const tbody = document.getElementById('exercisesBody');
    const currentDay = parseInt(document.getElementById('daySelect').value);
    const dayExercises = exercises
        .filter(ex => ex.day === currentDay)
        .sort((a, b) => a.order - b.order);

    tbody.innerHTML = '';

    if (dayExercises.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--accent-color);">لا توجد تمارين مضافة لهذا اليوم</td></tr>`;
        return;
    }

    dayExercises.forEach(ex => {
        const index = exercises.indexOf(ex);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ex.order}</td>
            <td>${ex.type}</td>
            <td>${ex.name}</td>
            <td>${ex.sets}</td>
            <td>${ex.reps}</td>
            <td>${ex.rest}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editExercise(${index})">تعديل</button>
                <button class="delete-btn" onclick="deleteExercise(${index})">حذف</button>
                ${ex.link && ex.link.trim() !== '' ? 
                    `<button class="view-btn" onclick="window.open('${ex.link}', '_blank')">عرض</button>` 
                    : ''
                }
            </td>
        `;
        tbody.appendChild(row);
    });
}

function resetForm() {
    document.getElementById('exerciseOrder').value = '1';
    document.getElementById('exerciseType').value = 'كارديو';
    updateExerciseNames();
    document.getElementById('sets').value = '3';
    document.getElementById('reps').value = '8-12';
    document.getElementById('rest').value = '1.5-2 min';
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
    document.getElementById('colorAccent').value = '#007efc';
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
    const currentDay = parseInt(document.getElementById('daySelect').value);
    const inputBgColor = getComputedStyle(document.documentElement).getPropertyValue('--input-bg-color').trim();
    const dayExercises = exercises.filter(ex => ex.day === currentDay).sort((a, b) => a.order - b.order);

    if (dayExercises.length === 0) {
        alert('لا توجد تمارين للمعاينة!');
        return;
    }

    // عرض نفس محتوى الـ PDF (عناوين إنجليزي، روابط)
    document.getElementById('previewDayTitle').textContent = 'Day ' + currentDay;
    const tbody = document.getElementById('previewExercisesBody');
    tbody.innerHTML = '';

    dayExercises.forEach((ex, i) => {
        const row = document.createElement('tr');
        row.style.background = i % 2 === 1 ? inputBgColor : '';
        row.innerHTML = `
            <td class="exercise-number">${ex.order}</td>
            <td class="exercise-name">
                ${ex.link ? `<a href="${ex.link}" target="_blank" class="exercise-link">${ex.name}</a>` : ex.name}
            </td>
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

// === دالة تحميل PDF مع نصوص إنجليزية (روابط clickable) ===
// تحميل PDF لليوم الحالي فقط
function downloadCurrentDayPDF() {
    const currentDay = parseInt(document.getElementById('daySelect').value);
    generatePDFForDay(currentDay);
}

// تحميل PDF لجميع الأيام (ملف واحد أو ملفات منفصلة؟ → ملف واحد متعدد الصفحات)
function downloadAllDaysPDF() {
    const allDays = [...new Set(exercises.map(ex => ex.day))].sort((a, b) => a - b);
    
    if (allDays.length === 0) {
        alert('لا توجد تمارين لتحميل PDF!');
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

    allDays.forEach((day, dayIndex) => {
        if (dayIndex > 0) pdf.addPage();

        const dayExercises = exercises
            .filter(ex => ex.day === day)
            .sort((a, b) => a.order - b.order);

        // خلفية الصفحة
        pdf.setFillColor(bg.r, bg.g, bg.b);
        pdf.rect(0, 0, 210, 297, 'F');

        // العنوان
        pdf.setTextColor(accent.r, accent.g, accent.b);
        pdf.setFontSize(32);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Workout Program', 105, 35, { align: 'center' });

        // اليوم
        pdf.setFontSize(24);
        pdf.setFillColor(accent.r, accent.g, accent.b);
        pdf.rect(65, 45, 80, 12, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.text(`Day ${day}`, 105, 53, { align: 'center' });

        // رأس الجدول
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

        dayExercises.forEach((ex, i) => {
            const rowY = y + (i * 12);

            if (i % 2 === 1) {
                pdf.setFillColor(inputBg.r, inputBg.g, inputBg.b);
                pdf.rect(15, rowY - 8, 180, 11, 'F');
            }

            pdf.text(ex.order.toString(), 22, rowY);

            if (ex.link && ex.link.trim() !== '') {
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

    // الفوتر
    pdf.setFontSize(10);
    pdf.setTextColor(180, 180, 180);
    pdf.text('Created by Workout Program Builder Tool', 105, 290, { align: 'center' });

    pdf.save(`Workout_Program_All_Days.pdf`);
}

// دالة مساعدة لتوليد PDF ليوم واحد (تُستخدم في الحالتين)
// دالة مساعدة لتوليد PDF ليوم واحد
function generatePDFForDay(day) {
    const dayExercises = exercises.filter(ex => ex.day === day).sort((a, b) => a.order - b.order);
    if (dayExercises.length === 0) {
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

    // خلفية الصفحة
    pdf.setFillColor(bg.r, bg.g, bg.b);
    pdf.rect(0, 0, 210, 297, 'F');

    // العنوان
    pdf.setTextColor(accent.r, accent.g, accent.b);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Workout Program', 105, 35, { align: 'center' });

    // اليوم
    pdf.setFontSize(24);
    pdf.setFillColor(accent.r, accent.g, accent.b);
    pdf.rect(65, 45, 80, 12, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Day ${day}`, 105, 53, { align: 'center' });

    // رأس الجدول
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

    dayExercises.forEach((ex, i) => {
        const rowY = y + (i * 12);

        if (i % 2 === 1) {
            pdf.setFillColor(inputBg.r, inputBg.g, inputBg.b);
            pdf.rect(15, rowY - 8, 180, 11, 'F');
        }

        pdf.text(ex.order.toString(), 22, rowY);

        if (ex.link && ex.link.trim() !== '') {
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

    // الفوتر
    pdf.setFontSize(10);
    pdf.setTextColor(180, 180, 180);
    pdf.text('Created by Workout Program Builder Tool', 105, 290, { align: 'center' });

    pdf.save(`Workout_Program_Day_${day}.pdf`);
}

// دالة تحميل الصورة (مع نصوص إنجليزية أيضًا)
function downloadImage() {
    const currentDay = parseInt(document.getElementById('daySelect').value);
    const dayExercises = exercises.filter(ex => ex.day === currentDay).sort((a, b) => a.order - b.order);

    if (dayExercises.length === 0) {
        alert('لا توجد تمارين لتحميل الصورة!');
        return;
    }

    const printPage = document.getElementById('printPage');
    printPage.innerHTML = createPrintPage(currentDay, dayExercises);

    // أبعاد A4 بالبكسل عند 300 DPI (أفضل جودة للطباعة)
    const width = 2480;  // 210 مم × 11.8 بكسل/مم تقريبًا
    const height = 3508; // 297 مم × 11.8 بكسل/مم

    printPage.style.width = width + 'px';
    printPage.style.height = height + 'px';
    printPage.style.padding = '80px';
    printPage.style.boxSizing = 'border-box';
    printPage.style.background = 'white';
    printPage.style.fontFamily = "'Cairo', sans-serif";
    printPage.style.color = '#000';
    printPage.style.display = 'block';

    html2canvas(printPage, {
        scale: 1,                    // مهم: نخليها 1 عشان ما يضربش في الـ width/height
        width: width,
        height: height,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Workout_Program_Day_${currentDay}_A4.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // إرجاع الـ div لحاله الأصلي
        printPage.style.display = 'none';
        printPage.style.width = '';
        printPage.style.height = '';
        printPage.style.padding = '';
        printPage.style.background = '';
    }).catch(err => {
        console.error(err);
        alert('حدث خطأ أثناء إنشاء الصورة!');
        printPage.style.display = 'none';
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

// -------------------- حماية بسيطة --------------------
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))) {
        e.preventDefault();
    }
});

// -------------------- دمج PDF --------------------
async function mergePDFs() {
    const mainFile = document.getElementById('mainPDF').files[0];
    const insertFile = document.getElementById('insertPDF').files[0];
    const pageNum = parseInt(document.getElementById('pageNumber').value) - 1; // 0-based
    const insertMode = document.getElementById('insertMode').value;
    const msg = document.getElementById('msg');

    if (!mainFile || !insertFile) {
        msg.textContent = 'يرجى اختيار كلا الملفين!';
        return;
    }

    msg.textContent = 'يتم الدمج...';

    try {
        const PDFLib = window.PDFLib; // من المكتبة المضافة
        const mainBytes = await mainFile.arrayBuffer();
        const mainDoc = await PDFLib.PDFDocument.load(mainBytes);

        let insertDoc;
        if (insertFile.type.startsWith('image/')) {
            // تحويل الصورة إلى PDF
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
        document.getElementById('downloadLink').download = 'merged.pdf';
        document.getElementById('downloadBtn').style.display = 'inline-block';

        msg.textContent = 'تم الدمج! اضغط على الزر للتحميل.';
    } catch (error) {
        msg.textContent = 'حدث خطأ أثناء الدمج: ' + error.message;
    }
}

function triggerDownload() {
    document.getElementById('downloadLink').click();
}

// التهيئة الأولية
document.addEventListener('DOMContentLoaded', function() {
    updateExerciseNames();
    renderExercises();
    loadSavedColors();
});

window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target == modal) {
        closePreview();
    }
};