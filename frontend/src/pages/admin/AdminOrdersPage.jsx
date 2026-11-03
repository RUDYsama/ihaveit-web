import React, { useEffect, useState } from 'react';
import {
  ShoppingBag, Check, Search, Truck,
  AlertCircle, Edit, Save
} from 'lucide-react';
import client from '../../api/client';
import Sidebar from '../../components/Sidebar';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await client.get('/orders/');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStartEdit = (order) => {
    setEditingOrderId(order.id);
    setEditStatus(order.status);
    setEditTracking(order.tracking_number || '');
  };

  const handleSaveOrder = async (orderId) => {
    setSaving(true);
    try {
      const res = await client.patch(`/orders/${orderId}/`, {
        status: editStatus,
        tracking_number: editTracking
      });
      setOrders(orders.map(o => o.id === orderId ? res.data : o));
      setEditingOrderId(null);
      setSuccessMsg(`อัปเดตคำสั่งซื้อ #${orderId} เรียบร้อยแล้ว`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('บันทึกไม่สำเร็จ: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = orders.filter(o =>
    String(o.id).includes(search) ||
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone?.includes(search)
  );

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <main className="dashboard-content">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#0f172a' }}>
            จัดการคำสั่งซื้อ (Orders Management)
          </h1>
          <p style={{ color: '#64748b' }}>
            อัปเดตสถานะการชำระเงิน ตรวจสอบที่อยู่จัดส่ง และกรอกหมายเลขพัสดุติดตาม
          </p>
        </div>

        {successMsg && (
          <div className="alert alert-success">
            <Check size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Search */}
        <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', maxWidth: 450 }}>
            <input
              type="text"
              placeholder="ค้นหาตามเลขที่คำสั่งซื้อ, ชื่อลูกค้า หรือเบอร์โทร..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ padding: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              กำลังโหลดคำสั่งซื้อ...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              ไม่พบคำสั่งซื้อในระบบ
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>เลขที่</th>
                    <th>ลูกค้า</th>
                    <th>รายการสินค้า</th>
                    <th>ยอดสุทธิ</th>
                    <th>สถานะ</th>
                    <th>เลขพัสดุ (Tracking)</th>
                    <th style={{ textAlign: 'right' }}>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const isEditing = editingOrderId === order.id;

                    return (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{order.customer_name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{order.customer_phone}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.customer_email}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>
                            {order.items?.map(it => (
                              <div key={it.id}>
                                • {it.product_name} <span style={{ color: '#2563eb' }}>x{it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: '#1e3a8a' }}>
                          ฿{parseFloat(order.total_amount).toLocaleString()}
                        </td>
                        <td>
                          {isEditing ? (
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="form-select"
                              style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                            >
                              <option value="Pending">Pending (รอดำเนินการ)</option>
                              <option value="Paid">Paid (ชำระแล้ว)</option>
                              <option value="Shipped">Shipped (กำลังจัดส่ง)</option>
                              <option value="Delivered">Delivered (จัดส่งสำเร็จ)</option>
                              <option value="Cancelled">Cancelled (ยกเลิก)</option>
                            </select>
                          ) : (
                            <span className={`badge ${
                              order.status === 'Paid' ? 'badge-primary' :
                              order.status === 'Shipped' ? 'badge-primary' :
                              order.status === 'Delivered' ? 'badge-success' :
                              order.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'
                            }`}>
                              {order.status}
                            </span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTracking}
                              onChange={(e) => setEditTracking(e.target.value)}
                              placeholder="เช่น TH123456789K"
                              className="form-input"
                              style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                            />
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: order.tracking_number ? '#2563eb' : '#94a3b8', fontWeight: 600 }}>
                              {order.tracking_number || '-'}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {isEditing ? (
                            <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                              <button
                                onClick={() => handleSaveOrder(order.id)}
                                disabled={saving}
                                className="btn btn-success btn-sm"
                              >
                                <Save size={15} /> บันทึก
                              </button>
                              <button
                                onClick={() => setEditingOrderId(null)}
                                className="btn btn-outline btn-sm"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(order)}
                              className="btn btn-outline btn-sm"
                            >
                              <Edit size={15} /> อัปเดต
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;
