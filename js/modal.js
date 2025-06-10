
const modalContent = document.querySelector('#itemModal .modal-content');
if (modalContent) {
    modalContent.style.backgroundColor = 'transparent';
    modalContent.style.backdropFilter = 'blur(20px)';
}

// Optional: Remove backdrop instantly
const backdrop = document.querySelector('.modal-backdrop');
if (backdrop) backdrop.remove();

// Then, attach the listener for future opens
document.querySelector('#itemModal').addEventListener('shown.bs.modal', function () {
    // Re-apply in case Bootstrap overrides it
    modalContent.style.backgroundColor = 'transparent';
    modalContent.style.backdropFilter = 'blur(20px)';
});
document.getElementById('itemModal').addEventListener('show.bs.modal', function() {
    const modalHeader = this.querySelector('.modal-header');
    if (modalHeader) {
        modalHeader.style.borderBottom = '1px solid var(--primary)'; // or your color
    }
});
document.getElementById('itemModal').addEventListener('show.bs.modal', function() {
    const modalHeader = this.querySelector('.modal-footer');
    if (modalHeader) {
        modalHeader.style.borderTop = '1px solid var(--primary)'; // or your color
    }
});
// Method 1: Direct style application
document.querySelectorAll('.modal-header .modal-title').forEach(title => {
  title.style.fontFamily = '"Great Vibes", cursive';
  title.style.color = '#ffffff';
  title.style.fontSize = '2em';
  title.style.letterSpacing = '2px';
});

// Method 2: Creating and injecting a style element (more maintainable)
const style = document.createElement('style');
style.textContent = `
  .modal-header .modal-title {
    font-family: "Great Vibes", cursive;
    color: #ffffff;
    font-size: 2em !important;
    letter-spacing: 2px !important;
  }
`;
document.head.appendChild(style);

// Apply styles to all matching elements
document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.style.background = `
    radial-gradient(
      ellipse farthest-corner at right bottom,
      #7363f3 0%,
      #3764ea 8%,
      #191195 30%,
      #201782 40%,
      transparent 80%
    ),
    radial-gradient(
      ellipse farthest-corner at left top,
      #ffffff 0%,
      #154286 8%,
      #15227a 25%,
      #191195 62.5%,
      #0a1763 100%
    )`;
    btn.style.color = '#ffffff';
    btn.style.textTransform = 'uppercase';
    btn.style.padding = '8px 25px';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
});
async function shareContent(event) {
    event.preventDefault(); // Stops the link from reloading the page

    const shareData = {
        title: "Check out this location!",
        text: "155 Queen St, Brisbane City QLD 4000, Australia",
        url: "https://maps.google.com/?q=155+Queen+St+Brisbane",
    };

    // Try Web Share API (works on mobile/HTTPS)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
            console.log("Shared successfully!");
        } catch (err) {
            console.log("Sharing cancelled or failed:", err);
            copyToClipboard(shareData.url); // Fallback to clipboard
        }
    } else {
        copyToClipboard(shareData.url); // Fallback for desktop/unsupported browsers
    }
}

// Clipboard fallback with better error handling
document.getElementById('shareButton').addEventListener('click', async function(e) {
  e.preventDefault();
  
  const shareData = {
    title: "Check out this location!",
    text: "155 Queen St, Brisbane City QLD 4000, Australia",
    url: "https://maps.google.com/?q=155+Queen+St+Brisbane",
  };

  // First try Web Share API
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      console.log('Share cancelled or failed:', err);
      // Continue to fallback
    }
  }

  // Fallback 1: Try clipboard API
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareData.url);
      showFeedback("Link copied to clipboard! 📋");
      return;
    } catch (clipboardErr) {
      console.log('Clipboard API failed:', clipboardErr);
      // Continue to next fallback
    }
  }

  // Fallback 2: Legacy clipboard method
  try {
    const textarea = document.createElement('textarea');
    textarea.value = shareData.url;
    textarea.style.position = 'fixed';  // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      showFeedback("Link copied to clipboard! 📋");
    } else {
      throw new Error('Legacy copy failed');
    }
  } catch (legacyErr) {
    console.log('Legacy copy failed:', legacyErr);
    // Final fallback
    showFeedback(`Please copy this link manually: ${shareData.url}`, true);
  }
});

function showFeedback(message, isManual = false) {
  const feedback = document.createElement('div');
  feedback.style.position = 'fixed';
  feedback.style.bottom = '20px';
  feedback.style.left = '50%';
  feedback.style.transform = 'translateX(-50%)';
  feedback.style.backgroundColor = '#333';
  feedback.style.color = 'white';
  feedback.style.padding = '10px 20px';
  feedback.style.borderRadius = '5px';
  feedback.style.zIndex = '1000';
  feedback.style.maxWidth = '80%';
  feedback.style.textAlign = 'center';
  feedback.textContent = message;
  
  if (isManual) {
    const link = document.createElement('div');
    link.style.marginTop = '5px';
    link.style.wordBreak = 'break-all';
    link.style.fontWeight = 'bold';
    link.textContent = shareData.url;
    feedback.appendChild(link);
  }
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.style.opacity = '0';
    setTimeout(() => document.body.removeChild(feedback), 300);
  }, 3000);
}


