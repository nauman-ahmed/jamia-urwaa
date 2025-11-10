'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdmissionForm from '@/components/AdmissionForm';

function AdmissionPageContent() {
  const searchParams = useSearchParams();
  const localeFromUrl = searchParams.get('locale') || 'en';
  
  return <AdmissionForm initialLocale={localeFromUrl} />;
}

export default function AdmissionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdmissionPageContent />
    </Suspense>
  );
}

