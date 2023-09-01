import {useEffect, useState} from 'react';
import {Tag} from "../../utils/types";
import {ALLOWED_IMG, LONG_REGEX, OBJECT_NAME_REGEX, SHORT_REGEX} from "../../utils/constants";


const useFormValidation = (name: string,
                           price: number | undefined,
                           shortDescription: string,
                           longDescription: string,
                           durationDate: Date | null | string,
                           image: File | null,
                           tags: Tag[]
    ) => {
        const [validName, setValidName] = useState(false);
        const [validPrice, setValidPrice] = useState(false);
        const [validShortDescription, setValidShortDescription] = useState(false)
        const [validLongDescription, setValidLongDescription] = useState(false)
        const [validImage, setValidImage] = useState(false);
        const [validDate, setValidDate] = useState(false)
        const [validTags, setValidTags] = useState(false)

        useEffect(() => {
            const result = OBJECT_NAME_REGEX.test(name);
            setValidName(result);
        }, [name]);

        useEffect(() => {
            const result = price ? price > 0 : false;
            setValidPrice(result);
        }, [price]);
        useEffect(() => {
            const result = SHORT_REGEX.test(shortDescription);

            setValidShortDescription(result);
        }, [shortDescription]);
        useEffect(() => {
            const result = LONG_REGEX.test(longDescription);
            setValidLongDescription(result);
        }, [longDescription]);
        useEffect(() => {
            setValidDate((durationDate != null) && (durationDate !== ""));
        }, [durationDate]);
        useEffect(() => {
            setValidTags(tags.length > 0 && tags.length <= 6);
        }, [tags]);

        useEffect(() => {
            if (image) {
                if (ALLOWED_IMG.includes(image.type)) {
                    setValidImage(true);
                } else {
                    setValidImage(false);
                }
            } else {
                setValidImage(true)
            }
        }, [image])

        const validateForm = () => {
            return validName && validPrice && validDate && validShortDescription && validLongDescription && validImage && validTags;
        };

        return {
            validName,
            validPrice,
            validShortDescription,
            validLongDescription,
            validDate,
            validImage,
            validTags,
            validateForm
        };
    }
;

export default useFormValidation;