import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaInfoCircle, FaMapMarkerAlt, FaImages, FaFileAlt } from "react-icons/fa";
import backImg from "../../../assets/back.jpg";
import { createListing, uploadListingPhotos } from "../api/listingsApi";

const AddListingPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [photos, setPhotos] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        tags: "",
        city: "",
        address: "",
        state: "",
        zipCode: "",
        pricePerNight: "",
        guests: "1",
        description: "",
        phone: "",
        companyWebsite: "",
        email: "",
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        amenities: [] as string[],
    });

    const mutation = useMutation({
        mutationFn: async () => {
            const listing = await createListing({
                title: formData.title,
                description: formData.description,
                location: [formData.address, formData.city, formData.state].filter(Boolean).join(", "),
                pricePerNight: Number(formData.pricePerNight),
                guests: Number(formData.guests),
                type: formData.type as "APARTMENT" | "HOUSE" | "VILLA" | "CABIN",
                amenities: formData.amenities.length > 0 ? formData.amenities : ["Internet"],
            });

            if (photos.length > 0) {
                try {
                    await uploadListingPhotos(listing.id, photos);
                } catch {
                    toast.error("Listing saved, but photo upload failed. You can try uploading photos later.");
                }
            }

            return listing;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["listings"] });
            toast.success("Listing created successfully");
            navigate("/listings");
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : "Failed to create listing";
            toast.error(message.includes("401") ? "Please log in again before creating a listing." : message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAmenityChange = (amenity: string) => {
        setFormData((current) => ({
            ...current,
            amenities: current.amenities.includes(amenity)
                ? current.amenities.filter((item) => item !== amenity)
                : [...current.amenities, amenity],
        }));
    };

    const handlePhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(event.target.files ?? []).slice(0, 5);
        setPhotos(selected);
    };

    return (
        <div className="min-h-screen dark:bg-slate-950 py-8" style={{ backgroundColor: "#f7f3ef" }}>
            {/* Hero Section */}
            <div className="relative text-white py-20 mb-8 bg-cover bg-center"
                style={{ backgroundImage: `url(${backImg})` }}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4">
                        Find Your <span className="text-rose-500">Dream</span> Place
                    </h1>
                    <p className="text-lg mb-8">
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto rounded-full shadow-2xl p-2 flex items-center gap-2" style={{ backgroundColor: "#f7f3ef" }}>
                        <div className="flex-1 flex items-center gap-2 px-4">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="What are you looking for?"
                                className="flex-1 py-3 outline-none text-slate-700"
                            />
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="flex-1 flex items-center gap-2 px-4">
                            <FaMapMarkerAlt className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Location"
                                className="flex-1 py-3 outline-none text-slate-700"
                            />
                        </div>
                        <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                            Search places
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <p className="text-rose-500 font-semibold mb-2">Listing</p>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Add Listing</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Discover exciting categories. <span className="text-rose-500">Find what you're looking for.</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 01 - Basic Information */}
                    <div className="dark:bg-slate-900 rounded-2xl shadow-sm p-8" style={{ backgroundColor: "#f7f3ef" }}>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                <FaInfoCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Basic Information</h3>
                                <p className="text-sm text-slate-500">
                                    There are many variations of passages of Lorem Ipsum available, but the majority here
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Listing Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="">Property type</option>
                                    <option value="APARTMENT">Apartment</option>
                                    <option value="HOUSE">House</option>
                                    <option value="VILLA">Villa</option>
                                    <option value="CABIN">Cabin</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Tags <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="Separate tags with commas"
                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* 02 - Location */}
                    <div className="dark:bg-slate-900 rounded-2xl shadow-sm p-8" style={{ backgroundColor: "#f7f3ef" }}>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                <FaMapMarkerAlt className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Location</h3>
                                <p className="text-sm text-slate-500">
                                    There are many variations of passages of Lorem Ipsum available, but the majority here
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    City <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                >
                                    <option value="">Select City</option>
                                    <option value="new-york">New York</option>
                                    <option value="los-angeles">Los Angeles</option>
                                    <option value="chicago">Chicago</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Address <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="8706 Herrick Ave. Valley..."
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    State <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Zip Code <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="2870"
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 03 - Gallery */}
                    <div className="dark:bg-slate-900 rounded-2xl shadow-sm p-8" style={{ backgroundColor: "#f7f3ef" }}>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                <FaImages className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Gallery</h3>
                                <p className="text-sm text-slate-500">
                                    There are many variations of passages of Lorem Ipsum available, but the majority here
                                </p>
                            </div>
                        </div>

                        <label className="block border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-12 text-center cursor-pointer hover:border-rose-400 transition-colors">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {photos.length > 0
                                        ? `${photos.length} photo${photos.length === 1 ? "" : "s"} selected`
                                        : "Recommended size 350 x 350 (png, jpg, jpeg)"}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Click to upload up to 5 listing photos</p>
                            </div>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                multiple
                                className="hidden"
                                onChange={handlePhotosChange}
                            />
                        </label>

                        {photos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                                {photos.map((photo) => (
                                    <img
                                        key={`${photo.name}-${photo.lastModified}`}
                                        src={URL.createObjectURL(photo)}
                                        alt={photo.name}
                                        className="w-full aspect-square rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 04 - Details */}
                    <div className="dark:bg-slate-900 rounded-2xl shadow-sm p-8" style={{ backgroundColor: "#f7f3ef" }}>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                <FaFileAlt className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Details</h3>
                                <p className="text-sm text-slate-500">
                                    There are many variations of passages of Lorem Ipsum available, but the majority here
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Please enter up to 4000 characters."
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white resize-none"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Price per night <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="pricePerNight"
                                        value={formData.pricePerNight}
                                        onChange={handleChange}
                                        min={1}
                                        required
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Guests <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        min={1}
                                        required
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Phone <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="(123) 456-7890"
                                        required
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Company website <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="companyWebsite"
                                        value={formData.companyWebsite}
                                        onChange={handleChange}
                                        placeholder="https://company.com"
                                        required
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Email Address <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@email.com"
                                        required
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Facebook Page <span className="text-slate-400 text-xs">(optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="facebook"
                                        value={formData.facebook}
                                        onChange={handleChange}
                                        placeholder="https://facebook.com"
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Twitter profile <span className="text-slate-400 text-xs">(optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="twitter"
                                        value={formData.twitter}
                                        onChange={handleChange}
                                        placeholder="https://twitter.com"
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Instagram profile <span className="text-slate-400 text-xs">(optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com"
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        LinkedIn page <span className="text-slate-400 text-xs">(optional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com"
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                    Property amenities <span className="text-slate-400 text-xs">(optional)</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {["Garden", "Security cameras", "Laundry", "Internet", "Pool", "Video surveillance", "Laundry room", "Jacuzzi"].map((amenity) => (
                                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.amenities.includes(amenity)}
                                                onChange={() => handleAmenityChange(amenity)}
                                                className="w-4 h-4 text-rose-500 border-slate-300 rounded focus:ring-rose-500"
                                            />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="px-12 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                        >
                            {mutation.isPending ? "Submitting..." : "Submit Listing"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddListingPage;
