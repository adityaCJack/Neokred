import React, { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "../utils/utils";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:5000/products");
      setProducts(result.data);
      setFilteredProducts(result.data);
    };
    fetchData();
  }, []);

  const handleSearch = (value) => {
    setFilteredProducts(
      products.filter((product) =>
        product.title.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const debouncedSearch = debounce(handleSearch, 1500);

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    const paginatedProducts = filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    if (e.target.checked) {
      setSelectedRows(paginatedProducts.map((product) => product.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleDeleteSelected = () => {
    setFilteredProducts((prev) =>
      prev.filter((product) => !selectedRows.includes(product.id))
    );
    setSelectedRows([]); // Clear selection after deletion
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Limit to show max 3 pages at a time
  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return [...Array(totalPages).keys()].map((num) => num + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, 3];
    } else if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearchInput}
        placeholder="Search products..."
      />
      <div className="selected-rows">{selectedRows.length} rows selected</div>
      <button
        onClick={handleDeleteSelected}
        disabled={selectedRows.length === 0}
        style={{
          marginBottom: "20px",
          padding: "10px 15px",
          backgroundColor: selectedRows.length > 0 ? "#dc3545" : "#ccc",
          color: "white",
          border: "none",
          cursor: selectedRows.length > 0 ? "pointer" : "not-allowed",
        }}
      >
        Delete Selected
      </button>

      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th>Title</th>
            <th>Price</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product) => (
            <tr
              key={product.id}
              style={{
                backgroundColor: selectedRows.includes(product.id)
                  ? "gray"
                  : "white",
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(product.id)}
                  onChange={() => handleSelectRow(product.id)}
                />
              </td>
              <td>{product.title}</td>
              <td>${product.price}</td>
              <td>
                <button
                  onClick={() =>
                    setFilteredProducts(
                      filteredProducts.filter((p) => p.id !== product.id)
                    )
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Section */}
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          &lt;
        </button>

        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              fontWeight: currentPage === page ? "bold" : "normal",
            }}
          >
            {page}
          </button>
        ))}

        <button onClick={handleNext} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Products;
