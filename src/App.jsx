/* eslint-disable jsx-a11y/accessible-emoji */
import { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categoryItem => categoryItem.id === product.categoryId,
  );

  const user = category
    ? usersFromServer.find(userItem => userItem.id === category.ownerId)
    : undefined;

  return { ...product, category, user };
});

function matchesUser(product, selectedUserId) {
  if (selectedUserId === null) return true;

  return product.user.id === selectedUserId;
}

function matchesSearch(product, query) {
  return product.name.toLowerCase().includes((query || '').toLowerCase());
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(
    product =>
      matchesUser(product, selectedUser) && matchesSearch(product, search),
  );

  const handleUserFilter = userId => {
    setSelectedUser(userId === selectedUser ? null : userId);
  };

  const resetAll = () => {
    setSelectedUser(null);
    setSearch('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            {/* Фільтр */}
            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                className={!selectedUser ? 'is-active' : ''}
                onClick={() => handleUserFilter(null)}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  className={selectedUser === user.id ? 'is-active' : ''}
                  onClick={() => handleUserFilter(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            {/* Пошук */}
            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {search && (
                  <span className="icon is-right">
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setSearch('')}
                    />
                  </span>
                )}
              </p>
            </div>

            {/* Reset All */}
            <div className="panel-block">
              <button
                type="button"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAll}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        {/* Таблиця */}
        <div className="box table-container">
          {filteredProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {filteredProducts.length > 0 && (
            <table className="table is-striped is-narrow is-fullwidth">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td className="has-text-weight-bold">{product.id}</td>
                    <td>{product.name}</td>
                    <td>
                      {product.category.icon} - {product.category.title}
                    </td>
                    <td
                      className={
                        product.user?.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
