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
            option.value = exercise.name; // هنا كان الخطأ - يجب أن يكون exercise.name
            option.textContent = exercise.name; // وهنا أيضاً
            option.dataset.link = exercise.link; // تخزين الرابط
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
        link: link, // إضافة الرابط
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
        // تعيين الرابط عند التعديل
        const nameSelect = document.getElementById('exerciseName');
        const options = nameSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === exercise.name) {
                options[i].selected = true;
                break;
            }
        }
    }, 100);
    document.getElementById('sets').value = exercise.sets;
    document.getElementById('reps').value = exercise.reps;
    document.getElementById('rest').value = exercise.rest;

    editingIndex = index;
    document.getElementById('addBtn').style.display = 'none';
    document.getElementById('updateBtn').style.display = 'block';
}

function updateExercise() {
    if (editingIndex !== -1) {
        const order = document.getElementById('exerciseOrder').value;
        const day = document.getElementById('daySelect').value;
        const type = document.getElementById('exerciseType').value;
        const nameSelect = document.getElementById('exerciseName');
        const name = nameSelect.value;
        const link = nameSelect.options[nameSelect.selectedIndex].dataset.link;
        const sets = document.getElementById('sets').value;
        const reps = document.getElementById('reps').value;
        const rest = document.getElementById('rest').value;

        exercises[editingIndex] = {
            order: parseInt(order),
            day: parseInt(day),
            type: type,
            name: name,
            link: link, // تحديث الرابط
            sets: sets,
            reps: reps,
            rest: rest
        };

        renderExercises();
        resetForm();
        editingIndex = -1;
    }
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
    
    const dayExercises = exercises.filter(ex => ex.day === currentDay);
    dayExercises.sort((a, b) => a.order - b.order);

    tbody.innerHTML = '';

    if (dayExercises.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" style="text-align: center; padding: 20px; color: var(--accent-color);">لا توجد تمارين مضافة لهذا اليوم</td>`;
        tbody.appendChild(row);
        return;
    }

    dayExercises.forEach((exercise, index) => {
        const originalIndex = exercises.findIndex(ex => 
            ex.order === exercise.order && ex.day === exercise.day
        );

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${exercise.order}</td>
            <td>${exercise.type}</td>
            <td>${exercise.name}</td>
            <td>${exercise.sets}</td>
            <td>${exercise.reps}</td>
            <td>${exercise.rest}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editExercise(${originalIndex})">تعديل</button>
                <button class="delete-btn" onclick="deleteExercise(${originalIndex})">حذف</button>
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
    
    document.getElementById('addBtn').style.display = 'block';
    document.getElementById('updateBtn').style.display = 'none';
}

// تطبيق الألوان
function applyColors() {
    const root = document.documentElement;
    const bgColor = document.getElementById('colorBg').value;
    const accentColor = document.getElementById('colorAccent').value;
    const textColor = document.getElementById('colorText').value;
    
    root.style.setProperty('--bg-color', bgColor);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--text-color', textColor);
    
    // حفظ الألوان في localStorage
    localStorage.setItem('workoutColors', JSON.stringify({
        bg: bgColor,
        accent: accentColor,
        text: textColor
    }));
}

// إعادة تعيين الألوان
function resetColors() {
    document.getElementById('colorBg').value = '#0a0f25';
    document.getElementById('colorAccent').value = '#ff6b35';
    document.getElementById('colorText').value = '#ffffff';
    applyColors();
}

// تحميل الألوان المحفوظة
function loadSavedColors() {
    const savedColors = localStorage.getItem('workoutColors');
    if (savedColors) {
        const colors = JSON.parse(savedColors);
        document.getElementById('colorBg').value = colors.bg;
        document.getElementById('colorAccent').value = colors.accent;
        document.getElementById('colorText').value = colors.text;
        applyColors();
    }
}

// معاينة البرنامج
// معاينة البرنامج مع الروابط
function showPreview() {
    const currentDay = parseInt(document.getElementById('daySelect').value);
    const dayExercises = exercises.filter(ex => ex.day === currentDay);
    
    if (dayExercises.length === 0) {
        alert('لا توجد تمارين للمعاينة!');
        return;
    }

    // تحديث نافذة المعاينة
    document.getElementById('previewDayTitle').textContent = 'Day ' + currentDay;
    
    const previewBody = document.getElementById('previewExercisesBody');
    previewBody.innerHTML = '';

    dayExercises.sort((a, b) => a.order - b.order).forEach(exercise => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="exercise-number">${exercise.order}</td>
            <td class="exercise-name">
                ${exercise.link ? 
                    `<a href="${exercise.link}" target="_blank" class="exercise-link">${exercise.name}</a>` : 
                    exercise.name
                }
            </td>
            <td>${exercise.sets}</td>
            <td>${exercise.reps}</td>
            <td>${exercise.rest}</td>
        `;
        previewBody.appendChild(row);
    });

    // إظهار نافذة المعاينة
    document.getElementById('previewModal').style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

function confirmDownload() {
    closePreview();
    // يمكنك اختيار ما تريد تحميله هنا
}

// إنشاء محتوى صفحة الطباعة - نسخة محسنة مع الروابط
// إنشاء محتوى صفحة الطباعة - نسخة محسنة مع الروابط القابلة للنقر
function createPrintPage(day, exercises) {
    const sortedExercises = exercises.sort((a, b) => a.order - b.order);
    
    return `
        <div class="print-page-header">
            <h1 class="print-page-title">برنامج التمرين</h1>
            <div class="print-page-day">Day ${day}</div>
        </div>
        
        <table class="print-table-pdf">
            <thead>
                <tr>
                    <th width="10%">#</th>
                    <th width="50%">اسم التمرين</th>
                    <th width="15%">المجموعات</th>
                    <th width="15%">التكرارات</th>
                    <th width="10%">الراحة</th>
                </tr>
            </thead>
            <tbody>
                ${sortedExercises.map(exercise => `
                    <tr>
                        <td class="print-exercise-number">${exercise.order}</td>
                        <td class="print-exercise-name">
                            ${exercise.link ? 
                                `<a href="${exercise.link}" target="_blank" class="exercise-link">${exercise.name}</a>` : 
                                exercise.name
                            }
                        </td>
                        <td>${exercise.sets}</td>
                        <td>${exercise.reps}</td>
                        <td>${exercise.rest}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="print-page-footer"></div>
    `;
}

// تحميل PDF - نسخة محسنة مع الروابط القابلة للنقر
// === الدالة الجديدة المحسّنة لتحميل PDF مع روابط قابلة للنقر ===
function downloadPDF() {
    const currentDay = parseInt(document.getElementById('daySelect').value);
    const dayExercises = exercises.filter(ex => ex.day === currentDay);
    
    if (dayExercises.length === 0) {
        alert('لا توجد تمارين لتحميل PDF!');
        return;
    }

    const sortedExercises = [...dayExercises].sort((a, b) => a.order - b.order);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // جلب الألوان المخصصة
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(h => h + h).join('');
        const bigint = parseInt(hex, 16);
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    }

    const accent = hexToRgb(accentColor);
    const text = hexToRgb(textColor);
    const bg = hexToRgb(bgColor);

    // خلفية الصفحة
    pdf.setFillColor(bg.r, bg.g, bg.b);
    pdf.rect(0, 0, 210, 297, 'F');

    // العنوان واليوم
    pdf.setTextColor(accent.r, accent.g, accent.b);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('برنامج التمرين', 105, 35, { align: 'center' });

    pdf.setFontSize(24);
    pdf.setFillColor(accent.r, accent.g, accent.b);
    pdf.rect(65, 45, 80, 12, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Day ${currentDay}`, 105, 53, { align: 'center' });

    // رأس الجدول
    let y = 70;
    pdf.setFillColor(accent.r, accent.g, accent.b);
    pdf.rect(15, y, 180, 12, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('#', 22, y + 8);
    pdf.text('اسم التمرين', 105, y + 8, { align: 'center' });
    pdf.text('المجموعات', 135, y + 8, { align: 'center' });
    pdf.text('التكرارات', 160, y + 8, { align: 'center' });
    pdf.text('الراحة', 185, y + 8, { align: 'center' });

    y += 15;
    pdf.setTextColor(text.r, text.g, text.b);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');

    sortedExercises.forEach((ex, i) => {
        const rowY = y + (i * 10);

        if (i % 2 === 0) {
            pdf.setFillColor(30, 35, 70);
            pdf.rect(15, rowY - 5, 180, 10, 'F');
        }

        pdf.text(ex.order.toString(), 22, rowY);
        
        // رابط قابل للنقر حقيقي
        if (ex.link && ex.link.trim() !== '') {
            pdf.textWithLink(ex.name, 40, rowY, { url: ex.link });
        } else {
            pdf.text(ex.name, 40, rowY);
        }

        pdf.text(ex.sets, 135, rowY, { align: 'center' });
        pdf.text(ex.reps, 160, rowY, { align: 'center' });
        pdf.text(ex.rest, 185, rowY, { align: 'center' });
    });

    pdf.setFontSize(10);
    pdf.setTextColor(180, 180, 180);
    pdf.text('تم إنشاؤه بواسطة أداة بناء البرامج الرياضية', 105, 290, { align: 'center' });

    pdf.save(`برنامج_التمرين_Day_${currentDay}.pdf`);
}

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    updateExerciseNames();
    renderExercises();
    loadSavedColors();
});

window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target == modal) closePreview();
}



// تحميل الصورة
function downloadImage() {
    const currentDay = parseInt(document.getElementById('daySelect').value);
    const dayExercises = exercises.filter(ex => ex.day === currentDay);
    
    if (dayExercises.length === 0) {
        alert('لا توجد تمارين لتحميل الصورة!');
        return;
    }

    // تحديث صفحة الطباعة
    const printPage = document.getElementById('printPage');
    printPage.innerHTML = createPrintPage(currentDay, dayExercises);

    // إظهار صفحة الطباعة مؤقتاً
    printPage.style.display = 'block';

    // تحويل إلى صورة
    html2canvas(printPage, {
        scale: 3,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-color'),
        useCORS: true,
        logging: false,
        width: printPage.scrollWidth,
        height: printPage.scrollHeight
    }).then(canvas => {
        // إنشاء رابط للتحميل
        const link = document.createElement('a');
        link.download = `برنامج_التمرين_Day_${currentDay}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // إخفاء صفحة الطباعة مرة أخرى
        printPage.style.display = 'none';
    }).catch(error => {
        console.error('Error generating image:', error);
        alert('حدث خطأ في توليد الصورة');
        printPage.style.display = 'none';
    });
}

// تحميل PDF - نسخة محسنة مع الروابط
function downloadPDF() {
    const currentDay = parseInt(document.getElementById('daySelect').value);
    const dayExercises = exercises.filter(ex => ex.day === currentDay);
    
    if (dayExercises.length === 0) {
        alert('لا توجد تمارين لتحميل PDF!');
        return;
    }

    // تحديث صفحة الطباعة
    const printPage = document.getElementById('printPage');
    printPage.innerHTML = createPrintPage(currentDay, dayExercises);

    // إظهار صفحة الطباعة مؤقتاً
    printPage.style.display = 'block';

    // حساب الارتفاع المناسب لمنع الصفحات الفارغة
    const contentHeight = printPage.scrollHeight;
    const scale = contentHeight > 1000 ? 1.5 : 2;

    // تحويل إلى PDF
    html2canvas(printPage, {
        scale: scale,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-color'),
        useCORS: true,
        logging: false,
        width: printPage.scrollWidth,
        height: printPage.scrollHeight
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // إضافة صفحة واحدة فقط
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // حفظ الملف
        pdf.save(`برنامج_التمرين_Day_${currentDay}.pdf`);
        
        // إخفاء صفحة الطباعة
        printPage.style.display = 'none';
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('حدث خطأ في توليد PDF');
        printPage.style.display = 'none';
    });
}

// التهيئة الأولية
document.addEventListener('DOMContentLoaded', function() {
    updateExerciseNames();
    renderExercises();
    loadSavedColors();
});

// إغلاق النافذة عند الضغط خارجها
window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target == modal) {
        closePreview();
    }
}


