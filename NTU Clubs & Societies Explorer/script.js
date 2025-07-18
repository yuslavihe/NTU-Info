import { clubsData } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // DOM Elements
    const clubGrid = document.getElementById('club-grid');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const sortOrder = document.getElementById('sort-order');
    const noResultsMessage = document.getElementById('no-results');
    const summaryStats = document.getElementById('summary-stats');
    const showSelectedBtn = document.getElementById('show-selected-btn');
    const showAllBtn = document.getElementById('show-all-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const selectedCount = document.getElementById('selected-count');

    let currentClubs = [...clubsData];
    let selectedClubs = new Set();
    let showOnlySelected = false;

    // Utility functions
    const updateSelectedCount = () => {
        selectedCount.textContent = selectedClubs.size;
        showSelectedBtn.disabled = selectedClubs.size === 0;
        showSelectedBtn.classList.toggle('opacity-50', selectedClubs.size === 0);
    };

    const toggleClubSelection = (clubName) => {
        if (selectedClubs.has(clubName)) {
            selectedClubs.delete(clubName);
        } else {
            selectedClubs.add(clubName);
        }
        updateSelectedCount();
        renderClubs();
    };

    // Filter clubs based on current filters
    const filterClubs = () => {
        const searchTerm = searchBar.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;

        return clubsData.filter(club => {
            const matchesSearch = club.name.toLowerCase().includes(searchTerm) ||
                club.description.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
            const matchesSelection = !showOnlySelected || selectedClubs.has(club.name);

            return matchesSearch && matchesCategory && matchesSelection;
        });
    };

    // Sort clubs based on current sort criteria
    const sortClubs = (clubs) => {
        const sortCriteria = sortBy.value;
        const order = sortOrder.value;

        return clubs.sort((a, b) => {
            let aValue, bValue;

            switch(sortCriteria) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'timeLoad':
                    aValue = a.timeLoad.value;
                    bValue = b.timeLoad.value;
                    break;
                case 'physicalLoad':
                    aValue = a.physicalLoad.score;
                    bValue = b.physicalLoad.score;
                    break;
                case 'mentalLoad':
                    aValue = a.mentalLoad.score;
                    bValue = b.mentalLoad.score;
                    break;
                case 'entryCriteria':
                    aValue = a.entryCriteria.score;
                    bValue = b.entryCriteria.score;
                    break;
                case 'ccaPoints':
                    aValue = a.ccaPoints;
                    bValue = b.ccaPoints;
                    break;
                default:
                    return 0;
            }

            if (order === 'desc') {
                return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });
    };

    // Render summary statistics
    const renderSummary = (clubs) => {
        if (clubs.length === 0) {
            summaryStats.innerHTML = '<p class="text-gray-500 col-span-full text-center">No clubs to analyze</p>';
            return;
        }

        const totalClubs = clubs.length;
        const avgTime = (clubs.reduce((sum, club) => sum + club.timeLoad.value, 0) / totalClubs).toFixed(1);
        const avgPhysical = (clubs.reduce((sum, club) => sum + club.physicalLoad.score, 0) / totalClubs).toFixed(1);
        const avgMental = (clubs.reduce((sum, club) => sum + club.mentalLoad.score, 0) / totalClubs).toFixed(1);
        const avgEntry = (clubs.reduce((sum, club) => sum + club.entryCriteria.score, 0) / totalClubs).toFixed(1);
        const avgCCA = (clubs.reduce((sum, club) => sum + club.ccaPoints, 0) / totalClubs).toFixed(1);

        summaryStats.innerHTML = `
            <div class="summary-item">
                <div class="text-2xl font-bold text-ntu-blue">${totalClubs}</div>
                <div class="text-sm text-gray-600">Total Clubs</div>
            </div>
            <div class="summary-item">
                <div class="text-2xl font-bold text-ntu-blue">${avgTime}h</div>
                <div class="text-sm text-gray-600">Avg Time/Week</div>
            </div>
            <div class="summary-item">
                <div class="text-2xl font-bold text-ntu-blue">${avgPhysical}/10</div>
                <div class="text-sm text-gray-600">Avg Physical</div>
            </div>
            <div class="summary-item">
                <div class="text-2xl font-bold text-ntu-blue">${avgMental}/10</div>
                <div class="text-sm text-gray-600">Avg Mental</div>
            </div>
            <div class="summary-item">
                <div class="text-2xl font-bold text-ntu-blue">${avgEntry}/10</div>
                <div class="text-sm text-gray-600">Avg Entry</div>
            </div>
            <div class="summary-item">
                <div class="text-2xl font-bold text-ntu-blue">${avgCCA}</div>
                <div class="text-sm text-gray-600">Avg CCA Points</div>
            </div>
        `;
    };

    // Render club cards
    const renderClubs = () => {
        const filteredClubs = filterClubs();
        const sortedClubs = sortClubs([...filteredClubs]);

        currentClubs = sortedClubs;

        clubGrid.innerHTML = '';

        if (sortedClubs.length === 0) {
            noResultsMessage.classList.remove('hidden');
            renderSummary([]);
            return;
        }

        noResultsMessage.classList.add('hidden');

        sortedClubs.forEach((club, index) => {
            const card = document.createElement('div');
            card.className = 'club-card bg-white rounded-xl shadow-sm p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ring-1 ring-gray-900/5';

            const rank = index + 1;
            const sortCriteria = sortBy.value;
            let rankValue = '';

            switch(sortCriteria) {
                case 'timeLoad':
                    rankValue = `${club.timeLoad.value}h/week`;
                    break;
                case 'physicalLoad':
                    rankValue = `${club.physicalLoad.score}/10`;
                    break;
                case 'mentalLoad':
                    rankValue = `${club.mentalLoad.score}/10`;
                    break;
                case 'entryCriteria':
                    rankValue = `${club.entryCriteria.score}/10`;
                    break;
                case 'ccaPoints':
                    rankValue = `${club.ccaPoints} pts`;
                    break;
                default:
                    rankValue = '';
            }

            const isSelected = selectedClubs.has(club.name);

            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-start gap-3 flex-1">
                        <div class="club-checkbox-container">
                            <input 
                                type="checkbox" 
                                id="checkbox-${club.name.replace(/\s+/g, '-')}"
                                class="club-checkbox w-5 h-5 text-ntu-red bg-gray-100 border-gray-300 rounded focus:ring-ntu-red focus:ring-2"
                                ${isSelected ? 'checked' : ''}
                                data-club-name="${club.name}"
                            >
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-lg text-gray-900 mb-1">${club.name}</h3>
                            <span class="category-badge text-white text-xs px-2 py-1 rounded-full font-medium" data-category="${club.category}">
                                ${club.category}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <!-- Google Search Button -->
                        <button 
                            class="google-search-btn p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 flex items-center justify-center"
                            data-club-name="${club.name}"
                            title="Search '${club.name}' on Google"
                        >
                            <i data-lucide="search" class="w-4 h-4 text-gray-600"></i>
                        </button>
                        ${rankValue ? `<div class="text-right">
                            <div class="text-xs text-gray-500">#${rank}</div>
                            <div class="text-sm font-semibold text-ntu-blue">${rankValue}</div>
                        </div>` : ''}
                    </div>
                </div>
                
                <p class="text-sm text-gray-600 mb-4 flex-1">${club.description}</p>
                
                <div class="space-y-2">
                    <div class="grid grid-cols-2 gap-2">
                        <div class="metric bg-gray-50 rounded-lg p-2">
                            <div class="text-xs text-gray-500">Time Load</div>
                            <div class="font-semibold text-sm">${club.timeLoad.value}h/week</div>
                        </div>
                        <div class="metric bg-gray-50 rounded-lg p-2">
                            <div class="text-xs text-gray-500">CCA Points</div>
                            <div class="font-semibold text-sm">${club.ccaPoints} pts</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-2">
                        <div class="metric bg-gray-50 rounded-lg p-2">
                            <div class="text-xs text-gray-500">Physical</div>
                            <div class="font-semibold text-sm">${club.physicalLoad.score}/10</div>
                        </div>
                        <div class="metric bg-gray-50 rounded-lg p-2">
                            <div class="text-xs text-gray-500">Mental</div>
                            <div class="font-semibold text-sm">${club.mentalLoad.score}/10</div>
                        </div>
                        <div class="metric bg-gray-50 rounded-lg p-2">
                            <div class="text-xs text-gray-500">Entry</div>
                            <div class="font-semibold text-sm">${club.entryCriteria.score}/10</div>
                        </div>
                    </div>
                </div>
            `;

            clubGrid.appendChild(card);
        });

        // Add event listeners to checkboxes
        document.querySelectorAll('.club-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const clubName = e.target.getAttribute('data-club-name');
                toggleClubSelection(clubName);
            });
        });

        renderSummary(sortedClubs);
        lucide.createIcons();
    };

    // Event listeners
    searchBar.addEventListener('input', renderClubs);
    categoryFilter.addEventListener('change', renderClubs);
    sortBy.addEventListener('change', renderClubs);
    sortOrder.addEventListener('change', renderClubs);

    showSelectedBtn.addEventListener('click', () => {
        showOnlySelected = true;
        showSelectedBtn.classList.add('bg-red-700');
        showAllBtn.classList.remove('bg-gray-700');
        renderClubs();
    });

    showAllBtn.addEventListener('click', () => {
        showOnlySelected = false;
        showAllBtn.classList.add('bg-gray-700');
        showSelectedBtn.classList.remove('bg-red-700');
        renderClubs();
    });

    clearAllBtn.addEventListener('click', () => {
        selectedClubs.clear();
        updateSelectedCount();
        renderClubs();
    });
    document.querySelectorAll('.google-search-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const clubName = e.currentTarget.getAttribute('data-club-name');
            const searchQuery = `NTU ${clubName}`;
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            window.open(googleSearchUrl, '_blank');
        });
    });

    // Initialize
    updateSelectedCount();
    renderClubs();
});
