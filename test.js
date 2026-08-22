
        /* Variables */
        let currentTab = 'tugas';
        let tasks = JSON.parse(localStorage.getItem('trackapp_tugas')) || [];
        let riwayat = JSON.parse(localStorage.getItem('trackapp_riwayat')) || JSON.parse(localStorage.getItem('trackapp_lomba')) || [];
        if (localStorage.getItem('trackapp_lomba') && !localStorage.getItem('trackapp_riwayat')) {
            localStorage.setItem('trackapp_riwayat', JSON.stringify(riwayat));
            localStorage.removeItem('trackapp_lomba');
        }
        let editingItemId = null;
        let itemToDeleteId = null;
        let expandedItemId = null;

        /* Dictionary */
        const i18n = {
            id: {
                appSubtitle: "Kelola Tugas & Riwayat Anda",
                tabTugas: "Tugas Kuliah",
                tabRiwayat: "Riwayat",
                emptyTitle: "Belum ada data.<br>Tekan tombol + untuk menambah.",
                addDesktop: "Tambah Data",
                installTitle: "Install TrackApp",
                installSub: "Tambahkan ke layar utama",
                installBtn: "Install",
                modalAddTugas: "Tambah Tugas",
                modalAddRiwayat: "Tambah Riwayat",
                modalEditTugas: "Edit Tugas",
                modalEditRiwayat: "Edit Riwayat",
                labelJudul: "Judul",
                labelDeskripsi: "Deskripsi",
                labelWaktuTugas: "Waktu Deadline",
                labelWaktuRiwayat: "Waktu Selesai",
                placeholderJudul: "Masukkan judul...",
                placeholderDeskripsi: "Tulis keterangan detail...",
                simpanKeRiwayat: "Simpan ke Riwayat setelah deadline",
                btnBatal: "Batal",
                btnSimpan: "Simpan",
                btnHapus: "Hapus",
                deleteTitle: "Hapus Data?",
                deleteSub: "Tindakan ini tidak dapat dibatalkan.",
                deadline: "Deadline: ",
                selesai: "Selesai/Waktu: ",
                notifTitle: "✅ Notifikasi Aktif!",
                notifBody: "TrackApp siap mengirim pengingat.",
                notifTaskTitle: "Pengingat Tugas! 📚",
                notifTaskBody: "Tugas \"{judul}\" deadline kurang dari 24 jam!"
            },
            en: {
                appSubtitle: "Manage your Tasks & History",
                tabTugas: "Assignments",
                tabRiwayat: "History",
                emptyTitle: "No data yet.<br>Press + button to add.",
                addDesktop: "Add Data",
                installTitle: "Install TrackApp",
                installSub: "Add to home screen",
                installBtn: "Install",
                modalAddTugas: "Add Task",
                modalAddRiwayat: "Add History",
                modalEditTugas: "Edit Task",
                modalEditRiwayat: "Edit History",
                labelJudul: "Title",
                labelDeskripsi: "Description",
                labelWaktuTugas: "Deadline Time",
                labelWaktuRiwayat: "Completion Time",
                placeholderJudul: "Enter title...",
                placeholderDeskripsi: "Write detailed description...",
                simpanKeRiwayat: "Save to History after deadline",
                btnBatal: "Cancel",
                btnSimpan: "Save",
                btnHapus: "Delete",
                deleteTitle: "Delete Data?",
                deleteSub: "This action cannot be undone.",
                deadline: "Deadline: ",
                selesai: "Completed/Time: ",
                notifTitle: "✅ Notifications Active!",
                notifBody: "TrackApp is ready to send reminders.",
                notifTaskTitle: "Task Reminder! 📚",
                notifTaskBody: "Task \"{judul}\" deadline is in less than 24 hours!"
            }
        };
        let currentLang = localStorage.getItem('trackapp_lang') || 'id';

        /* Theme & Dark Mode */
        let isDarkMode = false;
        function initTheme() {
            const storedTheme = localStorage.getItem('trackapp_theme');
            if (storedTheme) {
                isDarkMode = storedTheme === 'dark';
            } else {
                isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            applyTheme();
        }

        function toggleTheme() {
            isDarkMode = !isDarkMode;
            localStorage.setItem('trackapp_theme', isDarkMode ? 'dark' : 'light');
            applyTheme();
        }

        function applyTheme() {
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            
            const sunIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
            const moonIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
            
            document.getElementById('icon-theme-mobile').innerHTML = isDarkMode ? sunIcon : moonIcon;
            document.getElementById('icon-theme-desktop').innerHTML = isDarkMode ? sunIcon : moonIcon;
            
            document.querySelector('meta[name="theme-color"]').setAttribute('content', isDarkMode ? '#1e40af' : '#2563eb');
        }

        /* Language */
        function toggleLang() {
            currentLang = currentLang === 'id' ? 'en' : 'id';
            localStorage.setItem('trackapp_lang', currentLang);
            applyLanguage();
            renderData();
        }

        function applyLanguage() {
            const knobMobile = document.getElementById('lang-knob-mobile');
            const knobDesktop = document.getElementById('lang-knob-desktop');
            if (currentLang === 'en') {
                if (knobMobile) { knobMobile.classList.remove('translate-x-0'); knobMobile.classList.add('translate-x-7'); }
                if (knobDesktop) { knobDesktop.classList.remove('translate-x-0'); knobDesktop.classList.add('translate-x-7'); }
            } else {
                if (knobMobile) { knobMobile.classList.remove('translate-x-7'); knobMobile.classList.add('translate-x-0'); }
                if (knobDesktop) { knobDesktop.classList.remove('translate-x-7'); knobDesktop.classList.add('translate-x-0'); }
            }
            
            const t = i18n[currentLang];
            document.getElementById('text-app-subtitle').textContent = t.appSubtitle;
            document.getElementById('text-tab-tugas').textContent = t.tabTugas;
            document.getElementById('text-tab-riwayat').textContent = t.tabRiwayat;
            document.getElementById('text-empty').innerHTML = t.emptyTitle;
            document.getElementById('text-add-desktop').textContent = t.addDesktop;
            
            document.getElementById('text-install-title').textContent = t.installTitle;
            document.getElementById('text-install-sub').textContent = t.installSub;
            document.getElementById('text-install-btn').textContent = t.installBtn;
            
            document.getElementById('label-judul').textContent = t.labelJudul;
            document.getElementById('label-deskripsi').textContent = t.labelDeskripsi;
            document.getElementById('label-simpan-riwayat').textContent = t.simpanKeRiwayat;
            
            document.getElementById('input-judul').placeholder = t.placeholderJudul;
            document.getElementById('input-deskripsi').placeholder = t.placeholderDeskripsi;
            
            document.getElementById('btn-batal').textContent = t.btnBatal;
            document.getElementById('btn-simpan').textContent = t.btnSimpan;
            
            document.getElementById('text-delete-title').textContent = t.deleteTitle;
            document.getElementById('text-delete-sub').textContent = t.deleteSub;
            document.getElementById('btn-delete-batal').textContent = t.btnBatal;
            document.getElementById('btn-delete-hapus').textContent = t.btnHapus;

            if (!document.getElementById('modal-overlay').classList.contains('hidden')) {
                updateModalLang();
            }
        }

        function updateModalLang() {
            const t = i18n[currentLang];
            if (editingItemId) {
                document.getElementById('modal-title').textContent = currentTab === 'tugas' ? t.modalEditTugas : t.modalEditRiwayat;
            } else {
                document.getElementById('modal-title').textContent = currentTab === 'tugas' ? t.modalAddTugas : t.modalAddRiwayat;
            }
            document.getElementById('label-waktu').textContent = currentTab === 'tugas' ? t.labelWaktuTugas : t.labelWaktuRiwayat;
        }

        /* DOM Variables */
        const tabTugasBtn = document.getElementById('tab-tugas');
        const tabRiwayatBtn = document.getElementById('tab-riwayat');
        const viewTugas = document.getElementById('view-tugas');
        const viewRiwayat = document.getElementById('view-riwayat');
        const emptyState = document.getElementById('empty-state');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        const inputWaktu = document.getElementById('input-waktu');
        const inputJudul = document.getElementById('input-judul');
        const inputDeskripsi = document.getElementById('input-deskripsi');
        const riwayatCheckboxContainer = document.getElementById('riwayat-checkbox-container');
        const inputSimpanRiwayat = document.getElementById('input-simpan-riwayat');
        const deleteModal = document.getElementById('delete-modal');
        const deleteModalContent = document.getElementById('delete-modal-content');

        /* Format */
        function formatDate(dateString, isDatetime) {
            const locale = currentLang === 'id' ? 'id-ID' : 'en-US';
            const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
            if (isDatetime) {
                options.hour = '2-digit';
                options.minute = '2-digit';
            }
            return new Date(dateString).toLocaleDateString(locale, options);
        }

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
        }

        function linkify(text) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 dark:text-blue-400 font-medium hover:underline hover:text-blue-700 dark:hover:text-blue-300" onclick="event.stopPropagation()">${url}</a>`);
        }

        /* Accordion */
        window.toggleDescription = function(id) {
            if (expandedItemId && expandedItemId !== id) {
                const prevContent = document.getElementById(`content-${expandedItemId}`);
                const prevArrow = document.getElementById(`arrow-${expandedItemId}`);
                if (prevContent) prevContent.classList.remove('accordion-open');
                if (prevArrow) prevArrow.classList.remove('rotate-90');
            }
            
            const currentContent = document.getElementById(`content-${id}`);
            const currentArrow = document.getElementById(`arrow-${id}`);
            
            if (expandedItemId === id) {
                currentContent.classList.remove('accordion-open');
                currentArrow.classList.remove('rotate-90');
                expandedItemId = null;
            } else {
                currentContent.classList.add('accordion-open');
                currentArrow.classList.add('rotate-90');
                expandedItemId = id;
            }
        }

        /* Tab */
        function switchTab(tab) {
            currentTab = tab;
            expandedItemId = null; 
            
            viewTugas.classList.remove('tab-enter');
            viewRiwayat.classList.remove('tab-enter');
            void viewTugas.offsetWidth;
            
            const activeClass = "flex-1 md:flex-none md:w-56 py-2 md:py-3 px-4 rounded-full md:rounded-xl font-semibold text-sm md:text-base transition-colors bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800 active:scale-95";
            const inactiveClass = "flex-1 md:flex-none md:w-56 py-2 md:py-3 px-4 rounded-full md:rounded-xl font-semibold text-sm md:text-base transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent active:scale-95";
            
            if (tab === 'tugas') {
                tabTugasBtn.className = activeClass;
                tabRiwayatBtn.className = inactiveClass;
                viewTugas.classList.remove('hidden');
                viewTugas.classList.add('flex', 'tab-enter');
                viewRiwayat.classList.add('hidden');
                viewRiwayat.classList.remove('flex');
            } else {
                tabRiwayatBtn.className = activeClass;
                tabTugasBtn.className = inactiveClass;
                viewRiwayat.classList.remove('hidden');
                viewRiwayat.classList.add('flex', 'tab-enter');
                viewTugas.classList.add('hidden');
                viewTugas.classList.remove('flex');
            }
            renderData();
        }

        /* List */
        function renderData() {
            const listContainer = currentTab === 'tugas' ? viewTugas : viewRiwayat;
            const dataArr = currentTab === 'tugas' ? tasks : riwayat;
            const t = i18n[currentLang];
            
            listContainer.innerHTML = '';
            
            if (dataArr.length === 0) {
                emptyState.classList.remove('hidden');
                return;
            }
            
            emptyState.classList.add('hidden');
            const sortedData = [...dataArr].sort((a, b) => currentTab === 'tugas' ? new Date(a.waktu) - new Date(b.waktu) : new Date(b.waktu) - new Date(a.waktu));

            sortedData.forEach((item, index) => {
                const isTugas = currentTab === 'tugas';
                const timeColorClass = isTugas ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400';
                const timeFormatted = formatDate(item.waktu, isTugas);
                const isExpanded = expandedItemId === item.id;
                const safeHTMLDeskripsi = linkify(escapeHTML(item.deskripsi));

                const card = document.createElement('div');
                card.id = `card-${item.id}`;
                card.className = "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative item-enter w-full";
                card.style.animationDelay = `${index * 30}ms`;
                
                const timePrefix = isTugas ? t.deadline : t.selesai;
                
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center gap-2 cursor-pointer flex-1" onclick="toggleDescription('${item.id}')">
                            <svg id="arrow-${item.id}" class="w-5 h-5 text-gray-400 dark:text-gray-500 transform transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg select-none break-all">${item.judul}</h3>
                        </div>
                        <div class="flex space-x-1 ml-3 flex-shrink-0">
                            <button onclick="openEditModal('${item.id}')" class="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 p-1.5 transition-all rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 active:scale-75">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button onclick="promptDelete('${item.id}')" class="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 transition-all rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 active:scale-75">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div id="content-${item.id}" class="accordion-content ${isExpanded ? 'accordion-open' : ''}">
                        <div class="accordion-inner">
                            <div class="pl-7 text-sm text-gray-600 dark:text-gray-400 mb-4 mt-2 whitespace-pre-wrap leading-relaxed break-words">${safeHTMLDeskripsi}</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center text-xs font-semibold ${timeColorClass} bg-gray-50 dark:bg-gray-700/50 inline-flex px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 mt-1">
                        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ${timePrefix} ${timeFormatted}
                    </div>
                `;
                listContainer.appendChild(card);
            });
        }

        /* Delete Dialog */
        window.promptDelete = function(id) {
            itemToDeleteId = id;
            document.getElementById('delete-modal').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('delete-modal').classList.remove('opacity-0');
                document.getElementById('delete-modal-content').classList.remove('scale-95');
            }, 10);
        }

        /* Execute Delete */
        window.closeDeleteModal = function() {
            document.getElementById('delete-modal').classList.add('opacity-0');
            document.getElementById('delete-modal-content').classList.add('scale-95');
            setTimeout(() => { document.getElementById('delete-modal').classList.add('hidden'); itemToDeleteId = null; }, 300);
        }

        window.executeDelete = function() {
            if(!itemToDeleteId) return;
            const currentId = itemToDeleteId;
            closeDeleteModal();
            
            const cardEl = document.getElementById(`card-${currentId}`);
            
            const performDelete = () => {
                if(currentTab === 'tugas') {
                    tasks = tasks.filter(t => t.id !== currentId);
                    localStorage.setItem('trackapp_tugas', JSON.stringify(tasks));
                } else {
                    riwayat = riwayat.filter(c => c.id !== currentId);
                    localStorage.setItem('trackapp_riwayat', JSON.stringify(riwayat));
                }
                renderData();
            };

            if (cardEl) {
                cardEl.classList.add('item-leave');
                setTimeout(performDelete, 300);
            } else {
                performDelete();
            }
        }

        /* Form Modal */
        window.openModal = function() {
            editingItemId = null;
            document.getElementById('add-form').reset();
            modalOverlay.classList.remove('hidden');
            setTimeout(() => {
                modalOverlay.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
            }, 10);

            updateModalLang();
            inputWaktu.type = "datetime-local";
            
            if (currentTab === 'tugas') {
                riwayatCheckboxContainer.classList.remove('hidden');
                riwayatCheckboxContainer.classList.add('flex');
            } else {
                riwayatCheckboxContainer.classList.add('hidden');
                riwayatCheckboxContainer.classList.remove('flex');
            }
        }

        window.openEditModal = function(id) {
            editingItemId = id;
            const item = (currentTab === 'tugas' ? tasks : riwayat).find(t => t.id === id);
            if(!item) return;

            inputJudul.value = item.judul;
            inputDeskripsi.value = item.deskripsi;
            inputWaktu.value = item.waktu;
            
            if (currentTab === 'tugas') {
                inputSimpanRiwayat.checked = item.simpanKeRiwayat || false;
            }

            modalOverlay.classList.remove('hidden');
            setTimeout(() => {
                modalOverlay.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
            }, 10);

            updateModalLang();
            inputWaktu.type = "datetime-local";
            
            if (currentTab === 'tugas') {
                riwayatCheckboxContainer.classList.remove('hidden');
                riwayatCheckboxContainer.classList.add('flex');
            } else {
                riwayatCheckboxContainer.classList.add('hidden');
                riwayatCheckboxContainer.classList.remove('flex');
            }
        }

        window.closeModal = function() {
            modalOverlay.classList.add('opacity-0');
            modalContent.classList.add('scale-95');
            setTimeout(() => {
                modalOverlay.classList.add('hidden');
                document.getElementById('add-form').reset();
                editingItemId = null;
            }, 300);
        }

        /* Save */
        window.saveData = function(e) {
            e.preventDefault();
            
            const doSave = () => {
                const targetArray = currentTab === 'tugas' ? tasks : riwayat;
                const simpanKeRiwayat = currentTab === 'tugas' ? inputSimpanRiwayat.checked : false;
                
                if (editingItemId) {
                    const itemIndex = targetArray.findIndex(t => t.id === editingItemId);
                    if (itemIndex > -1) {
                        targetArray[itemIndex] = { ...targetArray[itemIndex], judul: inputJudul.value, deskripsi: inputDeskripsi.value, waktu: inputWaktu.value, simpanKeRiwayat, notified: false };
                    }
                } else {
                    targetArray.push({ id: Date.now().toString(), judul: inputJudul.value, deskripsi: inputDeskripsi.value, waktu: inputWaktu.value, simpanKeRiwayat, notified: false });
                }

                if (currentTab === 'tugas') {
                    localStorage.setItem('trackapp_tugas', JSON.stringify(tasks));
                    checkDeadlines(); 
                } else {
                    localStorage.setItem('trackapp_riwayat', JSON.stringify(riwayat));
                }

                expandedItemId = editingItemId || targetArray[targetArray.length - 1].id;
                closeModal();
                renderData();
            };

            if ("Notification" in window && Notification.permission === "default") {
                Notification.requestPermission().then(permission => {
                    const t = i18n[currentLang];
                    if (permission === "granted") triggerNotification(t.notifTitle, t.notifBody);
                    doSave();
                });
            } else {
                doSave();
            }
        }

        /* Notify */
        function triggerNotification(title, body) {
            const options = { body: body, icon: "./icon.png", vibrate: [200, 100, 200] };
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(reg => reg.showNotification(title, options)).catch(() => new Notification(title, options));
            } else {
                new Notification(title, options);
            }
        }

        /* Deadline & Auto-Archive */
        function checkDeadlines() {
            const now = new Date().getTime();
            let changedTugas = false;
            let changedRiwayat = false;
            const t = i18n[currentLang];

            // Proses auto hapus/pindah jika waktu habis
            const remainingTasks = [];
            tasks.forEach(task => {
                const timeDiff = new Date(task.waktu).getTime() - now;
                if (timeDiff < 0) {
                    // Deadline habis
                    if (task.simpanKeRiwayat) {
                        riwayat.push(task);
                        changedRiwayat = true;
                    }
                    changedTugas = true;
                } else {
                    remainingTasks.push(task);
                }
            });

            if (changedTugas) {
                tasks = remainingTasks;
                localStorage.setItem('trackapp_tugas', JSON.stringify(tasks));
                if (currentTab === 'tugas') renderData();
            }
            if (changedRiwayat) {
                localStorage.setItem('trackapp_riwayat', JSON.stringify(riwayat));
                if (currentTab === 'riwayat') renderData();
            }

            // Notifikasi
            if (!("Notification" in window) || Notification.permission !== "granted") return;
            
            let notifiedChanged = false;
            tasks.forEach(task => {
                if (!task.notified) {
                    const timeDiff = new Date(task.waktu).getTime() - now;
                    if (timeDiff > 0 && timeDiff <= (24 * 60 * 60 * 1000)) {
                        const title = t.notifTaskTitle;
                        const body = t.notifTaskBody.replace('{judul}', task.judul);
                        triggerNotification(title, body);
                        task.notified = true;
                        notifiedChanged = true;
                    }
                }
            });

            if (notifiedChanged) {
                localStorage.setItem('trackapp_tugas', JSON.stringify(tasks));
            }
        }

        /* Init */
        initTheme();
        applyLanguage();
        renderData();
        checkDeadlines();
        setInterval(checkDeadlines, 60000);

        /* Manifest */
        const appManifest = {
            "name": "TrackApp",
            "short_name": "TrackApp",
            "start_url": ".",
            "display": "standalone",
            "background_color": isDarkMode ? "#111827" : "#ffffff",
            "theme_color": "#2563eb",
            "icons": [{ "src": "./icon.png", "sizes": "512x512", "type": "image/png" }]
        };
        document.getElementById('dynamic-manifest').setAttribute('href', 'data:application/manifest+json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appManifest)));

        /* Install */
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            document.getElementById('install-banner').classList.remove('hidden');
        });

        document.getElementById('install-btn').addEventListener('click', async () => {
            document.getElementById('install-banner').classList.add('hidden');
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt = null;
            }
        });

        window.closeInstallBanner = function() {
            document.getElementById('install-banner').classList.add('hidden');
        };

        /* Worker Check */
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js').catch(() => { });
            });
        }
    