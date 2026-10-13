import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { EDisclaimerType } from '@/enums/userEnums';
import { myFetch } from '@/utils/myFetch';
import { toast } from 'sonner';

function CustomJodit({ type }: { type: EDisclaimerType }) {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    let ignore = false;
    if (type) {
      myFetch(`/disclaimer?type=${type}`, { method: "GET" }).then((res) => {
        if (!ignore && res?.success) {
          setContent(res?.data);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [type]);

  const config = useMemo(
    () => ({
      readonly: false,
      // placeholder: 'Start typing...',
      buttons: [
        'bold',
        'italic',
        'underline',
        '|',
        'ul',
        'ol',
        '|',
        'font',
        'fontsize',
        'brush',
        // '|',
        // 'image',
        // 'link',
        '|',
        'align',
        'undo',
        'redo'
      ],
      height: 'calc(100vh - 230px)',
      uploader: {
        insertImageAsBase64URI: true
      }
    }),
    []
  );

  const handleBlur = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleOnSave = async () => {
    //console.log(content);
    const payload = {
      content: content,
      type: type
    }
    const res = await myFetch(`/disclaimer`, { method: "POST", body: payload });
    //console.log("Update Content : ", res)

    if (res?.success) {
      toast.success("Content updated successfully");
    } else {
      toast.error(res?.message || "Failed to update content");
    }
  }

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={handleBlur}
      />
      <div className="flex justify-end mt-4">
        <button onClick={handleOnSave} className="inline-block w-100 px-10 py-2 bg-[#272727] hover:bg-[#272727]/90 text-white border border-gray-400 rounded-lg transitionClr">Save</button>
      </div>
    </div>
  );
}

export default CustomJodit;
