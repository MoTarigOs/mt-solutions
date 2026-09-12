
export async function sendContactEmail(formData) {
  formData.append("access_key", "3943b1bb-bb91-4caa-a50b-231cb78e0151" || "");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { success: false, message: "Server returned an unexpected response format. Please try again." };
    }

    const data = await response.json();

    if (data.success) {
      return { success: true, message: "Your message has been sent successfully!" };
    } else {
      return { success: false, message: data.message || "Something went wrong." };
    }
  } catch (error) {
    console.error("Contact Form Server Action Error:", error);
    return { success: false, message: "Server error. Please try again later." };
  }
}