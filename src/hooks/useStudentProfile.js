import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useStudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { items } = await base44.entities.StudentProfile.filter(
          {},
          { sort: "-created_date", limit: 1 }
        );
        if (active) setProfile(items[0] ?? null);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return { profile, loading };
}
