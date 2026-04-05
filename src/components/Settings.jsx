import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile } = useFinance();

  const [form, setForm] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    updateProfile(form);

    setIsEditing(false); 
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm"
          >
            Cancel
          </button>
        )}
      </div>

     
      {!isEditing ? (
        <div className="space-y-4">

          
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img src={user.avatar} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {user.name?.[0] || 'U'}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email || "No email added"}</p>
            </div>
          </div>

        </div>
      ) : (

     
        <div className="space-y-4">

          <div className="flex items-center gap-4">
            {form.avatar ? (
              <img src={form.avatar} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {form.name?.[0] || 'U'}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setForm(prev => ({ ...prev, avatar: reader.result }));
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>

          
          <input
            type="text"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="w-full px-4 py-2 rounded-xl border bg-gray-50 dark:bg-gray-900"
          />

          
          <input
            type="email"
            value={form.email || ''}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-xl border bg-gray-50 dark:bg-gray-900"
          />

       
          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-primary-600 text-white rounded-xl"
          >
            Save Changes
          </button>

        </div>
      )}
    </div>
  );
};

export default Settings;