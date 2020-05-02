export class StravaFeed {
  constructor(element) {
    this.element = element;
    this.access_token = null;
    this.refresh_token = null;
    this.maps_key = null;

    this.init();
  }

  init() {
    this.getTokens();
    this.fetchData();
  }

  getTokens() {
    const accessMatch = window.location.hash.match(/access_token=([^&]+)(&|$)/);
    this.access_token = accessMatch && accessMatch[1];
    const refreshMatch = window.location.hash.match(/refresh_token=([^&]+)(&|$)/);
    this.refresh_token = refreshMatch && refreshMatch[1];
    const mapsMatch = window.location.hash.match(/maps_key=([^&]+)(&|$)/);
    this.maps_key = mapsMatch && mapsMatch[1];
  }

  formatTime(time) {
    const parts = [];
    const hours = Math.floor(time / (60 * 60));
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    const minutes = Math.floor(time / 60) % 60;
    if (hours > 0 || minutes > 0) {
      parts.push(`${minutes}m`);
    }
    const seconds = time % 60;
    parts.push(`${seconds}s`);
    return parts.join(' ');
  }
  
  formatDistance(distance) {
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(Math.round(distance / 100) / 10).toFixed(1)}km`
  }

  getMapUrl(polymap, x, y) {
    const params = new URLSearchParams({
      key: this.maps_key,
      size: `${x},${y}@2x`,
      shape: `border:DD3333|weight:2|cmp|enc:${polymap.summary_polyline}`
    });
    return `https://open.mapquestapi.com/staticmap/v5/map?${params.toString()}`
  }

  fetchData() {
    fetch(`./strava?access_token=${this.access_token}&refresh_token=${this.refresh_token}`)
      .then(response => response.json())
      .then((data) => {
        const activities = data.activities.slice(0, 5);
        this.render({
          athlete: data.athlete,
          activities
        });
      });
  }

  render({ activities, athlete }) {
    this.element.innerHTML = activities.map((activity) => {
      const name = `${athlete.firstname} ${athlete.lastname}`;
      const date = new Date(activity.start_date_local);
      const time = date.toLocaleTimeString().split(':').slice(0, 2).join(':')
      return `<li class="card">
        <div class="card__header">
          <img class="card__avatar card__avatar--round" src="${athlete.profile_medium}" height="40" width="40" alt="${name} " />
          <h3 class="card__title">${activity.name}</h3>
          <p class="card__subtitle">${date.toDateString()} at ${time}</p>
        </div>
        ${(activity.map.summary_polyline ? `<img class="card__map" src="${this.getMapUrl(activity.map, 600, 338)}" alt="Map of ${activity.name}" height="338" widht="600" />` : '')}
        <div class="card__detail">
          <p class="card__description">
            ${activity.type}:
            Distance: ${this.formatDistance(activity.distance)}
            Elevation: ${this.formatDistance(activity.total_elevation_gain)}
            Time: ${this.formatTime(activity.moving_time)}
          </p>
          <ul class="h-unstyled-list card__actions">
            <li>Kudos: ${activity.kudos_count}</li>
            <li>Comments: ${activity.comment_count}</li>
            <li>Trophies: ${activity.achievement_count}</li>
          </ul>
        </div>
      </li>`;
    }).join('');
  }
}
