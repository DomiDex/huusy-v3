'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthTabs() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className='w-full'>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className='flex space-x-1 rounded-xl bg-primary-900/20 p-1'>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${
                selected
                  ? 'bg-secondary-500 text-primary-950 shadow'
                  : 'text-primary-100 hover:bg-primary-900/30 hover:text-primary-50'
              }`
            }
          >
            Login
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ${
                selected
                  ? 'bg-secondary-500 text-primary-950 shadow'
                  : 'text-primary-100 hover:bg-primary-900/30 hover:text-primary-50'
              }`
            }
          >
            Register
          </Tab>
        </Tab.List>
        <Tab.Panels className='mt-6'>
          <Tab.Panel>
            <LoginForm />
          </Tab.Panel>
          <Tab.Panel>
            <RegisterForm />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
