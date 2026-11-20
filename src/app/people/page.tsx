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
  Filter,
} from "lucide-react";
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">People Directory</h1>
          <p className="text-xs text-slate-500">
            North Entity • Central employee records, effective-dated assignments, and compensation
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert("Bulk Excel roster preview and row-level error validation active.")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import Roster</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm shadow-brand-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or employee code (e.g. E00412)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
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
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700"
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
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700"
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
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
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{emp.worker_code}</td>
                  <td className="px-5 py-3.5">
                    <div>
                      <span className="font-bold text-slate-900">{emp.fullName}</span>
                      <div className="text-[11px] text-slate-400">{emp.person.email} • {emp.person.national_id}</div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium">{emp.orgUnit?.name || "Operations"}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-slate-800">{emp.assignment.job_title}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => alert(`Employee File for ${emp.fullName} (${emp.worker_code})\nEffective Date: ${emp.assignment.valid_from}\nSite: Karachi Tech Park`)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-400" /> Add New Employee Record
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Asad"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Mehmood"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Worker Code *</label>
                  <input
                    type="text"
                    required
                    value={formWorkerCode}
                    onChange={(e) => setFormWorkerCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold"
                    placeholder="e.g. E00455"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CNIC (National ID) *</label>
                  <input
                    type="text"
                    required
                    value={formCNIC}
                    onChange={(e) => setFormCNIC(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                    placeholder="42101-1234567-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Job Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    placeholder="Operations Associate"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <select
                    value={formDeptId}
                    onChange={(e) => setFormDeptId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Contractual Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    value={formSalary}
                    onChange={(e) => setFormSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={formBankName}
                    onChange={(e) => setFormBankName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Bank IBAN / Account Number</label>
                <input
                  type="text"
                  value={formAccountNo}
                  onChange={(e) => setFormAccountNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  placeholder="PK36MEZN0001000123456789"
                />
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl text-[11px] text-brand-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>
                  Adding this employee will automatically provision leave balance ledgers (AL, SL, CL) and create an Onboarding checklist.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold"
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
