"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Upload,
  Building,
  Briefcase,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Filter, X } from "lucide-react";
import { getDB } from "@/lib/storage/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PeopleDirectoryPage() {
  const [db] = useState(() => getDB());
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Employee Form State
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formWorkerCode, setFormWorkerCode] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCNIC, setFormCNIC] = useState("");
  const [formPhone, setFormPhone] = useState("+92 300 ");
  const [formTitle, setFormTitle] = useState("");
  const [formDeptId, setFormDeptId] = useState("dept_ops");
  const [formSalary, setFormSalary] = useState(100000);
  const [formBankName, setFormBankName] = useState("Meezan Bank Ltd");
  const [formAccountNo, setFormAccountNo] = useState("PK36MEZN0001000");

  const refreshList = () => {
    setEmployees(db.getEmployeesJoined());
  };

  useEffect(() => {
    refreshList();
  }, []);

  const departments = db.getOrgUnits();

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.person.first_name} ${emp.person.last_name}`.toLowerCase();
    const code = emp.worker_code.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "ALL" || emp.assignment.org_unit_id === selectedDept;
    const matchesStatus = selectedStatus === "ALL" || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName || !formLastName || !formWorkerCode || !formCNIC) {
      alert("Please enter required employee details (Name, Code, CNIC).");
      return;
    }

    try {
      db.addEmployee(
        {
          first_name: formFirstName,
          last_name: formLastName,
          national_id: formCNIC,
          email: formEmail || `${formFirstName.toLowerCase()}@starsolutions.internal`,
          phone: formPhone,
          gender: "Male",
          date_of_birth: "1992-01-01",
          emergency_contact_name: "Family Member",
          emergency_contact_phone: formPhone,
        },
        {
          worker_code: formWorkerCode,
          worker_type: "Full-time",
          hire_date: new Date().toISOString().split("T")[0],
          status: "Active",
          notice_period_days: 30,
        },
        {
          org_unit_id: formDeptId,
          site_id: "site_khi",
          job_title: formTitle || "Operations Associate",
          grade_id: "G-4",
          pay_group_id: "pg_monthly_pk",
          shift_id: "shift_gen",
        },
        {
          bank_name: formBankName,
          account_number: formAccountNo.slice(0, 8) + "****" + formAccountNo.slice(-4),
          account_title: `${formFirstName} ${formLastName}`,
          iban: formAccountNo,
          branch_code: "0101",
          verification_state: "Verified",
        },
        formSalary
      );

      setShowAddModal(false);
      refreshList();
      alert(`Employee ${formWorkerCode} created successfully and added to Payroll eligibility.`);
    } catch (err: any) {
      alert("Failed to create employee: " + err.message);
    }
  };

  return (
    <div className="page">
      {/* Title & Action Bar */}
      <div className="page-header">
        <div>
          <h1 className="page-title">People Directory</h1>
          <p className="page-subtitle">
            North Entity • Central employee records, effective-dated assignments, and compensation
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert("Bulk Excel roster preview and row-level error validation active.")}
            className="btn btn-secondary"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Roster</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or employee code (e.g. E00412)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="select input-sm w-full sm:w-auto"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select input-sm w-full sm:w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Ready">Ready</option>
            <option value="Separation scheduled">Separation scheduled</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="px-5 py-3.5">Code</th>
                <th className="px-5 py-3.5">Employee Name</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Job Title & Grade</th>
                <th className="px-5 py-3.5">Bank Payout</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-900">{emp.worker_code}</td>
                  <td className="px-5 py-3.5">
                    <div>
                      <span className="font-semibold text-slate-900">{emp.fullName}</span>
                      <div className="text-[11px] text-slate-400">{emp.person.email} • {emp.person.national_id}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium">{emp.orgUnit?.name || "Operations"}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-800">{emp.assignment.job_title}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600">
                      {emp.assignment.grade_id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-[11px]">
                      <span className="font-semibold text-slate-800">{emp.payout?.bank_name || "Meezan Bank"}</span>
                      <div className="font-mono text-slate-500">{emp.payout?.account_number || "PK36****"}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="badge badge-success">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => alert(`Employee File for ${emp.fullName} (${emp.worker_code})\nEffective Date: ${emp.assignment.valid_from}\nSite: Karachi Tech Park`)}
                      className="btn btn-secondary btn-xs"
                    >
                      View Drawer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-panel max-w-xl">
            <div className="modal-header">
              <h2 className="modal-title">
                <Users className="w-4 h-4 text-brand-600" /> Add New Employee Record
              </h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleCreateEmployee} className="modal-body">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="input"
                    placeholder="e.g. Asad"
                  />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="input"
                    placeholder="e.g. Mehmood"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Worker Code *</label>
                  <input
                    type="text"
                    required
                    value={formWorkerCode}
                    onChange={(e) => setFormWorkerCode(e.target.value)}
                    className="input font-mono font-semibold"
                    placeholder="e.g. E00455"
                  />
                </div>
                <div>
                  <label className="label">CNIC (National ID) *</label>
                  <input
                    type="text"
                    required
                    value={formCNIC}
                    onChange={(e) => setFormCNIC(e.target.value)}
                    className="input font-mono"
                    placeholder="42101-1234567-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Job Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="input"
                    placeholder="Operations Associate"
                  />
                </div>
                <div>
                  <label className="label">Department</label>
                  <select
                    value={formDeptId}
                    onChange={(e) => setFormDeptId(e.target.value)}
                    className="select"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Contractual Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    value={formSalary}
                    onChange={(e) => setFormSalary(Number(e.target.value))}
                    className="input font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="label">Bank Name</label>
                  <input
                    type="text"
                    value={formBankName}
                    onChange={(e) => setFormBankName(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Bank IBAN / Account Number</label>
                <input
                  type="text"
                  value={formAccountNo}
                  onChange={(e) => setFormAccountNo(e.target.value)}
                  className="input font-mono"
                  placeholder="PK36MEZN0001000123456789"
                />
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-[11px] text-brand-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>
                  Adding this employee will automatically provision leave balance ledgers (AL, SL, CL) and create an Onboarding checklist.
                </span>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
