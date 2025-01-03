import React from 'react';
import styles from './page.module.css';

const ToggleSwitch = ({ children, value, onConfigChange, isChecked }) => {
  console.log("ToggleSwitch")
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
      type="checkbox" value={value} checked={isChecked} onChange={(e) => onConfigChange(e)} className="sr-only peer peer-custom"
      />
      <div
      className="custom-color w-11 h-6 bg-light-gray rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors peer-checked:bg-sky-600"
      ></div>
      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{children}</span>
    </label>
  )
}

export default ToggleSwitch
