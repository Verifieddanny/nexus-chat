import React from 'react';
import { Search01Icon } from 'hugeicons-react';
import { DemoUser } from '../../constant/demoUsers';
import type { User } from '../../types';

interface SearchBarProps {
  search: string;
  user: User | null;
  handleSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, user, handleSearch }) => {
  return (
    <div className="input-wrapper" style={{ background: '#0f172a' }}>
      <i><Search01Icon size={16} /></i>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        disabled={DemoUser.some(userId => user?._id === userId)}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ fontSize: '0.9rem', padding: '0.6rem 0.6rem 0.6rem 2.5rem', cursor: DemoUser.some(userId => user?._id === userId) ? "not-allowed" : "pointer" }}
      />
    </div>
  );
};

export default SearchBar;
