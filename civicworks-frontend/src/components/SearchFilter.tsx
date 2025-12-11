import React, { useState } from 'react';

type FilterOptions = {
    search: string;
    category: string;
    status: string;
    priority: string;
    isEmergency: boolean;
    nearMe: boolean;
    sortBy: string;
    sortOrder: string;
};

const CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'road', label: 'Road' },
    { value: 'water', label: 'Water' },
    { value: 'sewage', label: 'Sewage' },
    { value: 'streetlight', label: 'Streetlight' },
    { value: 'bridge', label: 'Bridge' },
    { value: 'building', label: 'Building' },
    { value: 'park', label: 'Park' },
    { value: 'other', label: 'Other' },
];

const STATUSES = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
];

const PRIORITIES = [
    { value: 'all', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
];

const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' },
    { value: 'likes', label: 'Most Liked' },
];

export function SearchFilter({
    onFilter,
    initialFilters
}: {
    onFilter: (filters: FilterOptions) => void;
    initialFilters?: Partial<FilterOptions>;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        search: initialFilters?.search || '',
        category: initialFilters?.category || 'all',
        status: initialFilters?.status || 'all',
        priority: initialFilters?.priority || 'all',
        isEmergency: initialFilters?.isEmergency || false,
        nearMe: initialFilters?.nearMe || false,
        sortBy: initialFilters?.sortBy || 'createdAt',
        sortOrder: initialFilters?.sortOrder || 'desc',
    });

    const handleChange = (key: keyof FilterOptions, value: string | boolean) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter(filters);
    };

    const clearFilters = () => {
        const defaultFilters: FilterOptions = {
            search: '',
            category: 'all',
            status: 'all',
            priority: 'all',
            isEmergency: false,
            nearMe: false,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        };
        setFilters(defaultFilters);
        onFilter(defaultFilters);
    };

    const activeFilterCount = [
        filters.category !== 'all',
        filters.status !== 'all',
        filters.priority !== 'all',
        filters.isEmergency,
        filters.nearMe,
    ].filter(Boolean).length;

    return (
        <div className="search-filter-container">
            <form onSubmit={handleSearchSubmit} className="search-bar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    placeholder="Search complaints..."
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                    className="search-input"
                />
                {filters.search && (
                    <button
                        type="button"
                        onClick={() => handleChange('search', '')}
                        className="clear-search-btn"
                        title="Clear search"
                    >
                        ✕
                    </button>
                )}
                <button
                    type="submit"
                    className="search-btn"
                    title="Search"
                >
                    Search
                </button>
                <button
                    type="button"
                    className={`filter-toggle ${activeFilterCount > 0 ? 'has-filters' : ''}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
                </button>
            </form>

            {isExpanded && (
                <div className="filter-panel">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                            >
                                {STATUSES.map(status => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Priority</label>
                            <select
                                value={filters.priority}
                                onChange={(e) => handleChange('priority', e.target.value)}
                            >
                                {PRIORITIES.map(priority => (
                                    <option key={priority.value} value={priority.value}>{priority.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleChange('sortBy', e.target.value)}
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter-row">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.isEmergency}
                                onChange={(e) => handleChange('isEmergency', e.target.checked)}
                            />
                            <span className="emergency-label">Emergency Only</span>
                        </label>

                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.nearMe}
                                onChange={(e) => handleChange('nearMe', e.target.checked)}
                            />
                            <span className="near-me-label">Near Me (5km)</span>
                        </label>

                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.sortOrder === 'asc'}
                                onChange={(e) => handleChange('sortOrder', e.target.checked ? 'asc' : 'desc')}
                            />
                            <span>Oldest First</span>
                        </label>

                        <button type="button" className="clear-filters" onClick={clearFilters}>
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .search-filter-container {
                    margin-bottom: 20px;
                }
                .search-bar {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 12px 16px;
                    transition: all 0.2s;
                }
                .search-bar:focus-within {
                    border-color: var(--brand-primary);
                    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
                }
                .search-icon {
                    color: var(--text-muted);
                    flex-shrink: 0;
                }
                .search-input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    font-size: 0.9375rem;
                    color: var(--text-primary);
                    outline: none;
                    min-width: 120px;
                }
                .search-input::placeholder {
                    color: var(--text-muted);
                }
                .clear-search-btn {
                    all: unset;
                    cursor: pointer;
                    padding: 4px 8px;
                    color: var(--text-muted);
                    font-size: 1rem;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                .clear-search-btn:hover {
                    background: var(--hover-bg);
                    color: var(--text-primary);
                }
                .search-btn {
                    all: unset;
                    cursor: pointer;
                    padding: 8px 16px;
                    background: transparent;
                    color: var(--brand-primary);
                    font-size: 0.875rem;
                    font-weight: 600;
                    border: 2px solid var(--brand-primary);
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }
                .search-btn:hover {
                    border-color: var(--text-primary);
                    color: var(--text-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                .search-btn:active {
                    transform: translateY(0);
                }
                .filter-toggle {
                    all: unset;
                    cursor: pointer;
                    padding: 8px 12px;
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: var(--text-secondary);
                    transition: all 0.3s ease;
                    position: relative;
                }
                .filter-toggle:hover {
                    border-color: var(--brand-primary);
                    color: var(--brand-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .filter-toggle:active {
                    transform: translateY(0);
                }
                .filter-toggle.has-filters {
                    border-color: var(--brand-primary);
                    color: var(--brand-primary);
                    background: rgba(17, 24, 39, 0.05);
                }
                .filter-count {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: var(--brand-primary);
                    color: var(--bg-secondary);
                    font-size: 0.65rem;
                    font-weight: 700;
                    min-width: 16px;
                    height: 16px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .filter-panel {
                    margin-top: 12px;
                    padding: 20px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                }
                .filter-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 16px;
                    align-items: flex-end;
                }
                .filter-row + .filter-row {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid var(--border-color);
                }
                .filter-group {
                    flex: 1;
                    min-width: 150px;
                }
                .filter-group label {
                    display: block;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    margin-bottom: 6px;
                }
                .filter-group select {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    font-size: 0.875rem;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    color: var(--text-primary);
                }
                .checkbox-label input {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }
                .emergency-label {
                    color: var(--danger);
                    font-weight: 600;
                }
                .near-me-label {
                    color: var(--brand-primary);
                    font-weight: 600;
                }
                .clear-filters {
                    all: unset;
                    cursor: pointer;
                    margin-left: auto;
                    font-size: 0.8125rem;
                    color: var(--text-muted);
                    transition: all 0.2s;
                }
                .clear-filters:hover {
                    color: var(--danger);
                    text-decoration: underline;
                }
                @media (max-width: 768px) {
                    .search-bar {
                        flex-wrap: wrap;
                        padding: 10px 12px;
                        gap: 8px;
                    }
                    .search-input {
                        width: 100%;
                        order: 1;
                    }
                    .search-icon {
                        order: 0;
                    }
                    .clear-search-btn {
                        order: 2;
                    }
                    .search-btn {
                        order: 3;
                        flex: 1;
                        min-width: 120px;
                    }
                    .filter-toggle {
                        order: 4;
                        flex: 1;
                        min-width: 120px;
                        justify-content: center;
                    }
                    .filter-panel {
                        padding: 16px;
                    }
                    .filter-group {
                        min-width: 100%;
                    }
                    .filter-row {
                        gap: 12px;
                        flex-direction: column;
                    }
                    .checkbox-label {
                        width: 100%;
                        padding: 8px 0;
                    }
                    .clear-filters {
                        margin-left: 0;
                        width: 100%;
                        text-align: center;
                        padding: 8px 0;
                    }
                }
                @media (max-width: 640px) {
                    .search-bar {
                        padding: 8px 10px;
                    }
                    .search-btn, .filter-toggle {
                        font-size: 0.8125rem;
                        padding: 6px 12px;
                    }
                }
            `}</style>
        </div>
    );
}
