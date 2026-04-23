import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/StaffInventory.css";
import StaffSidebar from "../../../components/StaffSidebar";
import { useSidebar } from "../../../components/useSidebar";
import {
  getInventory,
  updateStock,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  restoreInventoryItem,
} from "../../../api/api";

// ASSETS
import appointmentIcon from "../../../assets/Appointment_Icon.png";
import bellIcon from "../../../assets/Bell_Icon.png";
import dashboardIcon from "../../../assets/Dashboard_Icon.png";
import inventoryIcon from "../../../assets/Inventory_Icon.png";
import activityLogIcon from "../../../assets/Medical_Icon.png";
import messageIcon from "../../../assets/Message_Icon.png";
import pawLogo from "../../../assets/paw.png";
import payHistoryIcon from "../../../assets/payment_icon.png";
import petsProfileIcon from "../../../assets/Pets_Icon.png";
import userIcon from "../../../assets/Profile.png";
import userManagementIcon from "../../../assets/UserManagement_Icon.png";

const StaffInventory = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { isOpen, toggle, close } = useSidebar();

  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Supplies",
    stock: 0,
    unit: "pcs",
    notes: "",
  });

  useEffect(() => {
    if (!user || user.role !== "staff") {
      navigate("/login");
      return;
    }
    loadInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInventory = () =>
    getInventory({ includeArchived: true })
      .then((r) => setItems(r.data))
      .catch(() => {});

  const activeItems = items.filter((i) => !i.isArchived);
  const totalItems = activeItems.length;
  const lowStockCount = activeItems.filter(
    (i) => i.status === "LowStock",
  ).length;

  const openCreate = () => {
    setEditing(null);
    setError("");
    setForm({
      name: "",
      category: "Supplies",
      stock: 0,
      unit: "pcs",
      notes: "",
    });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setError("");
    setForm({
      name: item.name,
      category: item.category,
      stock: item.stock,
      unit: item.unit,
      notes: item.notes || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setError("");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, stock: Number(form.stock) };
      if (editing) {
        await updateInventoryItem(editing.id, payload);
      } else {
        await createInventoryItem(payload);
      }
      closeModal();
      await loadInventory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStock = async (item) => {
    const val = prompt(`Enter new stock for ${item.name}:`, item.stock);
    if (val === null || isNaN(val)) return;
    await updateStock(item.id, parseInt(val));
    loadInventory();
  };

  const toggleArchive = async (item) => {
    try {
      if (item.isArchived) await restoreInventoryItem(item.id);
      else await deleteInventoryItem(item.id);
      await loadInventory();
    } catch {
      setError("Failed to update item status");
    }
  };

  return (
    <div className="dashboard-container">
      <StaffSidebar isOpen={isOpen} onClose={close} />

      <main className="main-area">
        <header className="top-bar">
          <button
            className="hamburger-btn"
            onClick={toggle}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
          <h2>Inventory Management</h2>
          <div className="top-bar-right">
            {/* Added the missing navigation handler here */}
            <button
              className="notif-btn"
              onClick={() => navigate("/staff-notifications")}
            >
              <img src={bellIcon} alt="Notif" />
            </button>
            <div
              className="user-profile"
              onClick={() => navigate("/staff-profile")}
            >
              <img src={userIcon} alt="Profile" />
            </div>
          </div>
        </header>

        <section className="content-body">
          <div className="inventory-header">
            <div className="inventory-stats">
              <div className="stat-box">
                <span className="stat-label">Total Items</span>
                <span className="stat-num">{totalItems}</span>
              </div>
              <div className="stat-box warning">
                <span className="stat-label">Low Stock</span>
                <span className="stat-num">{lowStockCount}</span>
              </div>
            </div>
            <button className="add-item-btn" onClick={openCreate}>
              + Add New Item
            </button>
          </div>

          <div className="inventory-card">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="item-name-cell">{item.name}</td>
                    <td>
                      <span className="cat-badge">{item.category}</span>
                    </td>
                    <td>
                      {item.stock} {item.unit}
                    </td>
                    <td>
                      <span
                        className={`stock-status ${item.status?.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="stock-btn"
                        onClick={() => handleUpdateStock(item)}
                      >
                        Update Stock
                      </button>
                      <button
                        className="stock-btn"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="stock-btn"
                        onClick={() => toggleArchive(item)}
                      >
                        {item.isArchived ? "Restore" : "Archive"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && <p className="modal-error">{error}</p>}
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={submitForm} className="user-modal-form">
              <h3>{editing ? "Edit Inventory Item" : "Add Inventory Item"}</h3>
              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={onChange}
                  >
                    <option value="Medication">Medication</option>
                    <option value="Vaccine">Vaccine</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={onChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    name="unit"
                    value={form.unit}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <input name="notes" value={form.notes} onChange={onChange} />
                </div>
              </div>
              {error && <p className="modal-error">{error}</p>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffInventory;
