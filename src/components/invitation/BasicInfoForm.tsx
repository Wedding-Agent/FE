'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvitation } from '@/contexts/InvitationContext';
import styles from './BasicInfoForm.module.css';

export function BasicInfoForm() {
  const { data, updateField } = useInvitation();
  const router = useRouter();

  const [form, setForm] = useState(() => ({
    groomName: data.groom.name || '',
    brideName: data.bride.name || '',
    groomFatherName: data.groom.fatherName || '',
    groomMotherName: data.groom.motherName || '',
    brideFatherName: data.bride.fatherName || '',
    brideMotherName: data.bride.motherName || '',
    venueName: data.wedding.hallName || '',
    venueAddress: data.wedding.address || '',
    weddingDate: data.wedding.date || '',
    weddingTime: data.wedding.time || '',
    parkingInfo: data.extraMessage || '',
    additionalInfo: data.additionalRequest || '',
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = useMemo(() => {
    const required = ['groomName', 'brideName', 'groomFatherName', 'groomMotherName', 'brideFatherName', 'brideMotherName', 'venueName', 'venueAddress', 'weddingDate', 'weddingTime'];
    return required.every((k) => String(form[k as keyof typeof form] ?? '').trim() !== '');
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateField('groom.name', form.groomName);
    updateField('groom.fatherName', form.groomFatherName);
    updateField('groom.motherName', form.groomMotherName);
    updateField('bride.name', form.brideName);
    updateField('bride.fatherName', form.brideFatherName);
    updateField('bride.motherName', form.brideMotherName);
    updateField('wedding.hallName', form.venueName);
    updateField('wedding.address', form.venueAddress);
    updateField('wedding.date', form.weddingDate);
    updateField('wedding.time', form.weddingTime);
    updateField('extraMessage', form.parkingInfo);
    updateField('additionalRequest', form.additionalInfo);
    router.push('/couple/invitation/photo');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* 신랑·신부 이름 */}
      <div className={styles.grid2}>
        <div>
          <label className={styles.labelLg}>신랑 이름 <span className={styles.req}>*</span></label>
          <input type="text" name="groomName" placeholder="홍길동" className={styles.input} value={form.groomName} onChange={handleChange} required />
        </div>
        <div>
          <label className={styles.labelLg}>신부 이름 <span className={styles.req}>*</span></label>
          <input type="text" name="brideName" placeholder="김영희" className={styles.input} value={form.brideName} onChange={handleChange} required />
        </div>
      </div>

      {/* 신랑 부모 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>신랑 부모님</h3>
        <div className={styles.grid2}>
          <div>
            <label className={styles.labelBase}>아버지 성함 <span className={styles.req}>*</span></label>
            <input type="text" name="groomFatherName" placeholder="홍아버지" className={styles.input} value={form.groomFatherName} onChange={handleChange} required />
          </div>
          <div>
            <label className={styles.labelBase}>어머니 성함 <span className={styles.req}>*</span></label>
            <input type="text" name="groomMotherName" placeholder="홍어머니" className={styles.input} value={form.groomMotherName} onChange={handleChange} required />
          </div>
        </div>
      </div>

      {/* 신부 부모 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>신부 부모님</h3>
        <div className={styles.grid2}>
          <div>
            <label className={styles.labelBase}>아버지 성함 <span className={styles.req}>*</span></label>
            <input type="text" name="brideFatherName" placeholder="김아버지" className={styles.input} value={form.brideFatherName} onChange={handleChange} required />
          </div>
          <div>
            <label className={styles.labelBase}>어머니 성함 <span className={styles.req}>*</span></label>
            <input type="text" name="brideMotherName" placeholder="김어머니" className={styles.input} value={form.brideMotherName} onChange={handleChange} required />
          </div>
        </div>
      </div>

      {/* 예식 정보 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>예식 정보</h3>
        <div className={styles.stack}>
          <div>
            <label className={styles.labelBase}>예식장 이름 <span className={styles.req}>*</span></label>
            <input type="text" name="venueName" placeholder="OO웨딩홀" className={styles.input} value={form.venueName} onChange={handleChange} required />
          </div>
          <div>
            <label className={styles.labelBase}>예식장 주소 <span className={styles.req}>*</span></label>
            <input type="text" name="venueAddress" placeholder="서울시 강남구 ..." className={styles.input} value={form.venueAddress} onChange={handleChange} required />
          </div>
          <div className={styles.grid2}>
            <div>
              <label className={styles.labelBase}>예식 날짜 <span className={styles.req}>*</span></label>
              <input type="date" name="weddingDate" className={styles.input} value={form.weddingDate} onChange={handleChange} required />
            </div>
            <div>
              <label className={styles.labelBase}>예식 시간 <span className={styles.req}>*</span></label>
              <input type="time" name="weddingTime" className={styles.input} value={form.weddingTime} onChange={handleChange} required />
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>추가 안내</h3>
        <div className={styles.stack}>
          <div>
            <label className={styles.labelBase}>주차 안내 / 기타 메시지</label>
            <textarea name="parkingInfo" placeholder="주차 안내, 교통편 등을 입력해주세요" className={styles.textarea} rows={3} value={form.parkingInfo} onChange={handleChange} />
          </div>
          <div>
            <label className={styles.labelBase}>AI에게 추가 요청사항</label>
            <textarea name="additionalInfo" placeholder="문구 스타일, 특별히 포함할 내용 등" className={styles.textarea} rows={3} value={form.additionalInfo} onChange={handleChange} />
          </div>
        </div>
      </div>

      <button type="submit" className={styles.nextBtn} disabled={!isValid}>
        다음 단계 →
      </button>
    </form>
  );
}
