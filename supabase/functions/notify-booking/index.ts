const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OWNER_EMAIL = "goddyrob31@gmail.com"
const OWNER_WHATSAPP = "254708580506"

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()

    // Build a human-readable summary
    let summary = ''
    if (type === 'booking') {
      summary = `📋 NEW BOOKING\n\n` +
        `👤 Name: ${data.client_name}\n` +
        `📱 Phone: ${data.phone}\n` +
        `📧 Email: ${data.email || 'N/A'}\n` +
        `💬 WhatsApp: ${data.whatsapp_number || 'N/A'}\n` +
        `📂 Category: ${data.category || 'N/A'}\n` +
        `🔧 Service: ${data.service || 'N/A'}\n` +
        `🖥️ Mode: ${data.mode || 'N/A'}\n` +
        `📅 Date: ${data.preferred_date || 'N/A'}\n` +
        `⏰ Time: ${data.preferred_time || 'N/A'}\n` +
        `📝 Notes: ${data.notes || 'None'}`
    } else {
      summary = `🆘 NEW SERVICE REQUEST\n\n` +
        `👤 Name: ${data.client_name}\n` +
        `📱 Phone: ${data.phone}\n` +
        `📧 Email: ${data.email || 'N/A'}\n` +
        `💬 WhatsApp: ${data.whatsapp_number || 'N/A'}\n` +
        `⚡ Urgency: ${data.urgency || 'Normal'}\n` +
        `📞 Preferred Contact: ${data.preferred_contact || 'N/A'}\n` +
        `📝 Description: ${data.description || 'None'}`
    }

    // Send WhatsApp notification via wa.me redirect URL (for logging/reference)
    const whatsappMessage = encodeURIComponent(summary)
    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${whatsappMessage}`

    // Return the summary and WhatsApp URL so the client can open it
    return new Response(
      JSON.stringify({ 
        success: true, 
        whatsappUrl,
        summary 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
