
import { useRef, useState } from "react";
import { MapPin, Phone, User } from "lucide-react";

import { CHECKOUT_LIMITS, validateCheckout } from "../../features/checkout/validation";
import { Card } from "../ui/card";
import FormField from "../ui/form-field";
import Input from "../ui/input";
import Textarea from "../ui/textarea";

const FIELD_ORDER = ["customerName", "phone", "deliveryAddress"];

/**
 * Controlled guest-details form. The submit button lives in the order
 * summary and targets this form through the `form` attribute.
 */
export default function CheckoutForm({ formId, onSubmit, disabled = false }) {
    const [values, setValues] = useState({ customerName: "", deliveryAddress: "", phone: "" });
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const refs = useRef({});

    const errors = validateCheckout(values);
    const visibleError = (field) => (submitted || touched[field] ? errors[field] : undefined);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (event) => {
        const { name } = event.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (disabled) return;

        setSubmitted(true);

        const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
        if (firstInvalid) {
            refs.current[firstInvalid]?.focus();
            return;
        }

        onSubmit({
            customerName: values.customerName.trim(),
            deliveryAddress: values.deliveryAddress.trim(),
            phone: values.phone.trim(),
        });
    };

    const register = (name) => ({
        name,
        value: values[name],
        onChange: handleChange,
        onBlur: handleBlur,
        disabled,
        ref: (node) => {
            refs.current[name] = node;
        },
    });

    return (
        <Card as="section" aria-labelledby={`${formId}-title`} className="p-5 sm:p-6">
            <h2 id={`${formId}-title`} className="text-lg font-bold text-foreground">
                Delivery details
            </h2>
            <p className="mt-1 text-sm text-muted">
                No account needed — we only use these details to deliver your order.
            </p>

            <form id={formId} noValidate onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
                <FormField
                    id="customerName"
                    label="Full name"
                    required
                    error={visibleError("customerName")}
                >
                    {(fieldProps) => (
                        <div className="relative">
                            <User size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                            <Input
                                {...fieldProps}
                                {...register("customerName")}
                                autoComplete="name"
                                maxLength={CHECKOUT_LIMITS.nameMax}
                                placeholder="Aasif Ali"
                                className="pl-10"
                            />
                        </div>
                    )}
                </FormField>

                <FormField
                    id="phone"
                    label="Phone number"
                    required
                    hint="We'll call only if there's an issue with delivery."
                    error={visibleError("phone")}
                >
                    {(fieldProps) => (
                        <div className="relative">
                            <Phone size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                            <Input
                                {...fieldProps}
                                {...register("phone")}
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                maxLength={20}
                                placeholder="98765 43210"
                                className="pl-10"
                            />
                        </div>
                    )}
                </FormField>

                <FormField
                    id="deliveryAddress"
                    label="Delivery address"
                    required
                    hint="House / flat number, street, area and city."
                    error={visibleError("deliveryAddress")}
                    className="sm:col-span-2"
                >
                    {(fieldProps) => (
                        <div className="relative">
                            <MapPin size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 text-muted" />
                            <Textarea
                                {...fieldProps}
                                {...register("deliveryAddress")}
                                autoComplete="street-address"
                                maxLength={CHECKOUT_LIMITS.addressMax}
                                placeholder="12, MG Road, Bengaluru, Karnataka"
                                className="pl-10"
                            />
                        </div>
                    )}
                </FormField>
            </form>
        </Card>
    );
}
