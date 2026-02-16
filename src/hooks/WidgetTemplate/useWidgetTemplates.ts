import { useState } from "react";
import GetWidgetTemplatesAPI from "../../api/WidgetTemplates/GetWidgetTemplates";
import type { WidgetTemplate } from "../../types/widget/widgetTemplates";

export const useWidgetTemplates = () => {
    const [data, setData] = useState<WidgetTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    const getWidgetTemplates= async () => {   
        try {
            const result = await GetWidgetTemplatesAPI();
            setData(result.result);
            
        } catch (error) {
            setData([]);
            setError("Something Went Wrong!!");
        } finally {
            setLoading(false);
        }
    };

    // Group templates by `type`
  const groupedTemplates = data.reduce((acc, template) => {
    const key = template.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(template);
    return acc;
  }, {} as Record<string, WidgetTemplate[]>);

    return { getWidgetTemplates, groupedTemplates, data, loading, error };
};

