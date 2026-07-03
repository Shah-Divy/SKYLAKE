import React, { useState, useEffect } from 'react';
import { Building2, Save, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { companyProfileService } from '../../services/companyProfileService';
import { getFileUrl } from '../../services/api';
import HtmlEditor from '../../components/HtmlEditor';

export default function ProfileManager() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Company Profile states
  const [companyProfile, setCompanyProfile] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [achievements, setAchievements] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await companyProfileService.getAdmin();
      if (response.success && response.data) {
        setCompanyProfile(response.data.companyProfile || '');
        setMission(response.data.mission || '');
        setVision(response.data.vision || '');
        setAchievements(response.data.achievements || '');
        setImage(response.data.image || null);
        setImagePreview(response.data.image ? getFileUrl(response.data.image) : '');
      } else {
        setErrorMsg('Failed to fetch company profile.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while loading the corporate profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!companyProfile.trim() || !mission.trim() || !vision.trim()) {
      alert('Please fill out the Company Profile description, Mission, and Vision guidelines.');
      return;
    }

    setSaveLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        companyProfile,
        mission,
        vision,
        achievements,
      };

      const response = await companyProfileService.update(payload);
      if (response.success) {
        setSuccessMsg('Corporate company profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(response.message || 'Failed to save profile changes.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while saving corporate identity settings.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please choose an image to upload.');
      return;
    }
    setUploadLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Use existing update endpoint to send image along with profile data
      const payload = {
        companyProfile,
        mission,
        vision,
        achievements,
        imageFile,
      };
      const response = await companyProfileService.update(payload);
      if (response.success && response.data) {
        setImage(response.data.image || null);
        setImagePreview(response.data.image ? getFileUrl(response.data.image) : '');
        setImageFile(null);
        setSuccessMsg('Profile image updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(response.message || 'Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while uploading the image.');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider bg-brand-teal/10 px-2.5 py-1 rounded-md border border-brand-teal/20">
            Corporate Identity
          </span>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mt-2 tracking-tight">
            Company Profile Configuration
          </h1>
        </div>
        <button
          onClick={fetchProfile}
          disabled={loading}
          className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 cursor-pointer shadow-sm disabled:opacity-50"
          title="Reload Profile"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-xl font-bold flex items-center gap-2">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl font-bold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form container */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/50 shadow-sm text-center text-slate-400 font-semibold w-full">
          <span className="inline-block border-2 border-slate-300 border-t-brand-teal w-6 h-6 rounded-full animate-spin mr-2 align-middle" />
          Loading corporate profile settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/50 shadow-sm space-y-6">
          
          <h3 className="font-display font-extrabold text-sm text-slate-950 flex items-center gap-1.5 pb-3 border-b border-slate-100">
            <Building2 className="w-4.5 h-4.5 text-brand-teal" />
            Intro Content Settings
          </h3>

          {/* Image preview & upload */}
          <div className="flex items-start gap-6">
            <div className="w-36 h-36 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Company" className="w-full h-full object-cover" />
              ) : (
                <div className="text-xs text-slate-400 px-3 text-center">No image uploaded</div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Company Image (Optional)</label>
              <div className="mb-3">
                <label className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  Choose File
                </label>
                {imagePreview && <span className="ml-2 text-xs text-emerald-600 font-semibold">File selected ✓</span>}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleImageUpload} disabled={uploadLoading} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs disabled:opacity-60 transition-colors">
                  {uploadLoading ? 'Uploading...' : 'Upload Image'}
                </button>
                <span className="text-xs text-slate-500">Recommended: 800×800 px, JPG/PNG</span>
              </div>
            </div>
          </div>

          {/* Primary Profile description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Primary Company Profile Description</label>
            <HtmlEditor
              value={companyProfile}
              onChange={setCompanyProfile}
              placeholder="e.g. 3ARK Industrial Automation is a leading system integration company..."
            />
          </div>

          {/* Mission & Vision side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Corporate Mission Statement</label>
              <HtmlEditor
                value={mission}
                onChange={setMission}
                placeholder="Mission of delivering robust controls solutions..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Corporate Vision Statement</label>
              <HtmlEditor
                value={vision}
                onChange={setVision}
                placeholder="Vision for the future of factory systems automation..."
              />
            </div>
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1.5">Achievements &amp; Milestones (Optional)</label>
            <HtmlEditor
              value={achievements}
              onChange={setAchievements}
              placeholder="e.g. Over 500+ successful installations, certified Siemens partners..."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saveLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              {saveLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-brand-teal" />
                  Save Profile Content
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
