// Emergency fix script - paste this in browser console
// This will directly call the API and handle the response

async function emergencyFixStorageCounts() {
  try {
    console.log('🔧 Starting emergency storage count fix...');
    
    const response = await fetch('/api/storages/fix-counts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Fix completed:', result);

    if (result.success) {
      const fixedCount = result.details?.length || 0;
      console.log(`🎉 Fixed ${fixedCount} storage(s)`);
      
      // Force page reload to see updated data
      window.location.reload();
    }

    return result;
  } catch (error) {
    console.error('❌ Emergency fix failed:', error);
    
    // If API fails, let's try to get more info
    console.log('🔍 Attempting to get more debugging info...');
    
    try {
      const storageId = window.location.pathname.split('/').pop();
      const diagResponse = await fetch(`/api/storages/${storageId}/diagnose`);
      
      if (diagResponse.ok) {
        const diagResult = await diagResponse.json();
        console.log('📊 Diagnostic info:', diagResult);
      }
    } catch (diagError) {
      console.error('❌ Diagnostic also failed:', diagError);
    }
  }
}

// Run the emergency fix
emergencyFixStorageCounts();